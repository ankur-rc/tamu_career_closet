class RentalsController < ApplicationController
  skip_before_action :authorize_request
  before_action :set_rental, only: [:show, :edit, :update, :destroy]


  # before_action :set_rental, only: [:show, :edit, :update, :destroy]

  # GET /rentals
  # GET /rentals.json
  def index
    # render jsonapi: Rental.all, include:  [:author, comments: [:author]],
    #        fields: {rentals: [:rental_id, :apparel_id, :checkout_date, :expected_return_date, :student_id]}
    @rentals = Rental.all
    # json_response(@rentals)
  end

  # GET /rentals/1
  # GET /rentals/1.json
  def show
  end

  # GET /rentals/new
  def new
    @rental = Rental.new
  end

  # GET /rentals/1/edit
  def edit
  end

  # POST /rentals
  # POST /rentals.json
  def create
    @rental = Rental.new(rental_params)

    respond_to do |format|
      if @rental.save
        format.html { redirect_to @rental, notice: 'Rental was successfully created.' }
        format.json { render :show, status: :created, location: @rental }
      else
        format.html { render :new }
        format.json { render json: @rental.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /rentals/1
  # PATCH/PUT /rentals/1.json
  def update
    respond_to do |format|
      if @rental.update(rental_params)
        format.html { redirect_to @rental, notice: 'Rental was successfully updated.' }
        format.json { render :show, status: :ok, location: @rental }
      else
        format.html { render :edit }
        format.json { render json: @rental.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /rentals/1
  # DELETE /rentals/1.json
  def destroy
    @rental.destroy
    respond_to do |format|
      format.html { redirect_to rentals_url, notice: 'Rental was successfully destroyed.' }
      format.json { head :no_content }
    end
  end



  def view_active_user
    @active_users = Rental.joins(:student).select("
	    students.uin as uin, students.first_name as name, rentals.checkout_date").where("
		    actual_return_date is NULL").group("rentals.student_id")
    render json:@active_users
  end    

  def view_checkedOut
    @checkedOut = Rental.joins(:apparel).select("
	    apparels.apparel_id as apparelId, apparels.article as article, apparels.sex as sex, apparels.size as size").where("
		    actual_return_date is NULL")
    render json:@checkedOut
   end 

  def pending_returnsAndDefaulters
    countOfPendingReturns=Rental.where(actual_return_date: nil).count
    countOfDefaulters=Rental.where('expected_return_date<? and actual_return_date IS NULL',DateTime.now).count()
    dictio=Hash.new()
    dictio["countOfPendingReturns"]=countOfPendingReturns
    dictio["countOfDefaulters"]=countOfDefaulters
    render json: dictio
  end


  def num_active_users_and_checked_out   
    @num_active = Rental.where("actual_return_date is NULL").distinct.pluck("student_id").count
	@num_checkedout = Rental.where("actual_return_date is NULL").count
	json_obj=Hash.new()
    json_obj["num_active"]=@num_active
    json_obj["num_checkedout"]=@num_checkedout
	render json:json_obj
  end
	

  def pending_returns
    countOfPendingReturns=Rental.where(actual_return_date: nil).count
    render json: countOfPendingReturns
  end



  def assignSuits
     response=Hash.new()
     begin
     studentUIN=params[:studentUIN]
     apparelId=params[:apparelId]
     @student=Student.findStudentByUIN(studentUIN)
     @apparel=Apparel.findApparelByApparelId(apparelId)
     @noOfCheckoutDays=Constant.where(:key=>"noOfCheckoutDays").first.value.to_i
     @lastCreatedRentalId=Rental.getLastRentalId
     @rental=Rental.new( :rental_id=>@lastCreatedRentalId+1,:apparel_id=>@apparel.apparel_id, :checkout_date=>Date.today(), :expected_return_date=>Date.today()+@noOfCheckoutDays,:student_id=>@student.id )
     if @rental.save
      responseMessage=createResponseMessage(200,Response_Message::SUCESS_MESSAGE)
      render json:responseMessage
     else
       render json:createResponseMessage(500,@rental.errors)
     end
     rescue =>e
     render json:createResponseMessage(500,e)
     end
  end

  def createResponseMessage(statusCode,statusMessage)
    response=Hash.new()
    response["statusCode"]=statusCode
    response["statusMessage"]=statusMessage
    return response
  end

  def receiveSuits
    response=Hash.new()
    begin
      studentUIN=params[:studentUIN]
      apparelId=params[:apparelId]
      @student=Student.findStudentByUIN(studentUIN)
      @apparel=Apparel.findApparelByApparelId(apparelId)
      @rental=Rental.where("student_id=? and apparel_id=? and actual_return_date IS NULL",@student.uin,@apparel.apparel_id).order("id DESC").first
      if @rental.update(actual_return_date:DateTime.now())
        responseMessage=createResponseMessage(200,Response_Message::SUCESS_MESSAGE)
        render json:responseMessage
      else
        render json:createResponseMessage(500,@rental.errors)
      end
    end
  rescue =>e
    render json:createResponseMessage(500,e)
  end

  def sendPendingEmails
    response=Hash.new()
    begin
      pending_returns_view=Rental.joins(:student).where("actual_return_date IS NULL and ?<expected_return_date and DATEDIFF(expected_return_date,?) < 2",DateTime.now,DateTime.now ).select("students.uin as uin, students.first_name as name,students.email as email, rentals.checkout_date as checkoutDate,
 rentals.expected_return_date as expectedReturnDate,rentals.id as rentalid, students.id as studentid").collect
      pending_returns_view.each do |return_pending|
      student_uin=return_pending["uin"]
      student_name=return_pending["name"]
      student_email=return_pending["email"]
      checkout_date=return_pending["checkoutDate"]
      expected_return_date=return_pending["expectedReturnDate"]
      PendingMailer.sendPendingMail(student_uin,student_name,student_email,checkout_date,expected_return_date).deliver_now
      end
      responseMessage=createResponseMessage(200,Response_Message::SUCESS_MESSAGE)
      render json:responseMessage
    end
    rescue =>e
    render json:createResponseMessage(500,e)
  end

  def sendOverDueEmails
    response=Hash.new()
    begin
     overdue_emails_view=Rental.joins(:student).where('expected_return_date<? and actual_return_date IS NULL',DateTime.now)
                             .select("students.uin as uin, students.first_name as name,students.email as email, rentals.checkout_date as checkoutDate,
  rentals.expected_return_date as expectedReturnDate,rentals.id as rentalid, students.id as studentid").collect
     overdue_emails_view.each do |overdue_email|
       student_uin=overdue_email["uin"]
       student_name=overdue_email["name"]
       student_email=overdue_email["email"]
       checkout_date=overdue_email["checkoutDate"]
       expected_return_date=overdue_email["expectedReturnDate"]
       PendingMailer.sendOverDueEmails(student_uin,student_name,student_email,checkout_date,expected_return_date).deliver_now
     end
     responseMessage=createResponseMessage(200,Response_Message::SUCESS_MESSAGE)
     render json:responseMessage
    end
    rescue =>e
    render json:createResponseMessage(500,e)
  end


  private
    # Use callbacks to share common setup or constraints between actions.
    def set_rental
      @rental = Rental.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def rental_params
      params.require(:rental).permit(:rental_id, :uin, :apparel_id, :checkout_date, :expected_return_date, :actual_return_date, :student_id)
    end



end
