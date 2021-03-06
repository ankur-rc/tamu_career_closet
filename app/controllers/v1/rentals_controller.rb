require 'tempfile'

module V1
  class RentalsController < ApplicationController
    before_action :set_rental, only: [:edit, :update, :destroy, :extend_rental] 
    before_action :join_students, only: [:show]

    # GET /rentals
    # GET /rentals.json
    def index
      @rentals = Rental.joins(:student, :apparel).select("rentals.id as id, apparels.apparel_id as apparel_Id , students.first_name as name, students.uin as uin, rentals.checkout_date as checkout_date, rentals.expected_return_date as expected_return_date, rentals.actual_return_date as actual_return_date, rentals.student_id as student_id, rentals.extension_count as extension_count").where("rentals.actual_return_date is NULL or rentals.checkout_date > ?", Date.today-7)
      json_response({success: true, data: @rentals}, :ok)
    end

    # GET /rentals/1
    # GET /rentals/1.json
    def show
      if @rentalrecord.empty?()
        json_response({success: false, message: Message.not_found('Rental record')}, :unprocessable_entity)
      else
        json_response({success: true, data: @rentalrecord[0]}, :ok)
      end
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
      Rental.create!(rental_params)
      json_response({success: true, message: Message.created_successfuly('Rental record')}, :created)
    end

    # PATCH/PUT /rentals/1
    # PATCH/PUT /rentals/1.json
    def update
      if @rental.empty?()
        json_response({success: false, message: Message.not_found('Rental record')}, :unprocessable_entity)
      else
        new_checkout_date = Date.parse(rental_params[:checkout_date])
        new_expected_return_date = Date.parse(rental_params[:expected_return_date])
        if (new_checkout_date > Date.today) || (new_checkout_date > new_expected_return_date)
          json_response({success: false, message: Message.invalid_date_combination}, :unprocessable_entity)
          return
        end

        @rental.update(rental_params)
        json_response({success: true, message: Message.updated_successfuly('Rental record')}, :ok)
      end
    end

    # DELETE /rentals/1
    # DELETE /rentals/1.json
    def destroy
      if @rental.empty?()
        json_response({success: false, message: Message.not_found('Rental record')}, :unprocessable_entity)
      else
        return_date = @rental[0].actual_return_date
        if return_date.blank?()
          json_response({success: false, message: Message.existing_association('ID')}, :unprocessable_entity)
          return
        end

        if Rental.destroy(@rental.first.id)
          json_response({success: true, message: Message.destroyed_successfuly('Rental record')}, :ok)
        else
          json_response({success: true, message: @rental.errors}, :ok)
        end
      end
    end

    def view_active_user
      active_users = Student.active_users
      json_response({success: true, data: active_users}, :ok)
    end

    def view_checked_out
      checked_out = Apparel.view_stock
      json_response({success: true, data: checked_out}, :ok)
    end

    def pending_returns_and_defaulters
      response = Hash.new()
      response["pendingreturns"] = Rental.where(actual_return_date: nil).count
      response["defaulters"] = Rental.where(
          'expected_return_date < ? and actual_return_date IS NULL', Date.today).count()

      json_response({success: true, data: response} , :ok)
    end

    def num_active_users_and_checked_out
      response = Hash.new()
      response["activeusers"] = Rental.where(
          "actual_return_date is NULL").distinct.pluck("student_id").count
      response["checkedoutusers"] = Rental.where("actual_return_date is NULL").count

      json_response({success: true, data: response}, :ok)
    end

    def pending_returns
      pending_returns_count = Rental.where(actual_return_date: nil).count
      json_response({success: true, data: pending_returns_count}, :ok)
    end

  def assign_suit
      begin
        student = Student.by_uin(params[:uin])
        apparel = Apparel.by_apparel_id(params[:apparel_id])
        checkout_days = Constant.where(key: :noOfCheckoutDays).first.value.to_i
        checkedOut = Rental.determine_ApparelCheckedOut(apparel.apparel_id)
       if checkedOut == true
      	  json_response({success:false, message:"Apparel already checked out"}, :internal_server_error)
       else
      	  @rental = Rental.new(apparel_id: apparel.id, checkout_date: DateTime.now,
            expected_return_date: Date.today + checkout_days, student_id: student.id)
      	  if @rental.save
            json_response({success:true, message: Message.assigned_success}, :ok)
      	  else
            json_response({success:false, message: @rental.errors}, :internal_server_error)
      	  end
       end
      end
      rescue =>e
	      json_response({success:false, message: e},:internal_server_error)
  end

  def return_suit
    begin
      student = Student.by_uin(params[:uin])
      apparel = Apparel.by_apparel_id(params[:apparel_id])
      @rental = Rental.where("student_id=? and apparel_id=? and actual_return_date IS NULL",
            student.id, apparel.id).order("id DESC").first
      if @rental==nil
         json_response({success:false, message:"Suit was never assigned"},:internal_server_error)
      else
        if @rental.update(actual_return_date: DateTime.now)
          json_response({success:true, message: Message.success_response}, :ok)
        else 
          json_response({success:false, message: @rental.errors}, :internal_server_error)
        end
      end    
      rescue =>e
	    json_response({success:false, message: e},:internal_server_error)
    end
  end  

  def extend_rental
    rentalId = params[:id]
    if @rental.empty?()
      json_response({success: false, message: Message.not_found('Rental record')}, :unprocessable_entity)
    else
      if not Rental.is_rental_checked_out(rentalId)
        json_response({success:false, message:"Suit was never assigned"},:internal_server_error)
      else
        checkout_days = Constant.where(key: :noOfCheckoutDays).first.value.to_i
        Rental.increment_extension_count(rentalId, checkout_days)
	json_response({success: true, message: Message.extended_successfuly}, :ok)
      end
    end
  end


   def getstudent
      apparel = Apparel.by_apparel_id(params[:apparel_id])
      @rental = Rental.where("apparel_id=? and actual_return_date IS NULL",apparel.id).order("id DESC").first
      if @rental == nil
        json_response({success: false, message: Message.not_found('Rental record')}, :unprocessable_entity)
      else
        student = Student.where(:id => @rental["student_id"])
        json_response({success: true, data: student}, :ok)
      end
   end  

    def send_pending_emails
      pending_returns = Rental.joins(:student).where("actual_return_date IS NULL and
          ? < expected_return_date and DATEDIFF(expected_return_date, ?) < 2",
          Date.today, Date.today).select("students.uin as uin, students.first_name as name,
              students.email as email, rentals.checkout_date as checkout_date,
              rentals.expected_return_date as expected_return_date").collect

      pending_returns.each do |pending_return|
        PendingMailer.mailer_pending_emails(pending_return["uin"], pending_return["name"],
            pending_return["email"], pending_return["checkout_date"],
            pending_return["expected_return_date"])
      end

      json_response({success:true, message: Message.success_response}, :ok)
    end

    def send_overdue_emails
      overdue_returns = Rental.joins(:student).where('expected_return_date < ? and
          actual_return_date IS NULL', Date.today).select("students.uin as uin,
              students.first_name as name, students.email as email, rentals.checkout_date as checkout_date,
              rentals.expected_return_date as expected_return_date,
              rentals.id as rentalid, students.id as studentid").collect

      overdue_returns.each do |overdue_return|
        PendingMailer.mailer_overdue_emails(overdue_return["uin"], overdue_return["name"],
            overdue_return["email"], overdue_return["checkout_date"],
            overdue_return["expected_return_date"])
      end

      json_response({success:true, message: Message.success_response}, :ok)
    end

    def list_reports
      report_files = Array.new
      S3_BUCKET.objects.each do |objectsummary|
        object = Hash.new
        object[:filename] = objectsummary.key
        object[:url] = objectsummary.public_url

        report_files.push(object)
      end

      json_response({success: true, data: report_files}, :ok)
    end

    def new_report
      respond_to do |format|
        format.html
        format.csv { send_data Rental.to_csv,
            filename: "rental-report-#{Date.today}.csv",
            type: 'text/csv', disposition: 'attachment' }
      end
    end

    def self.create_report
      report_data = Rental.to_csv

      tempfile = Tempfile.new("rental-report-#{DateTime.now}.csv")
      tempfile << report_data
      tempfile.close

      obj = S3_BUCKET.object("reports/rental-report-#{Date.today}.csv")
      obj.upload_file(tempfile.path, options = {content_type: 'text/csv'})

      tempfile.unlink
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_rental
        @rental = Rental.where(id: params[:id])
      end

      def join_students
        @rentalrecord = Rental.joins(:student, :apparel).select("rentals.id as id, apparels.apparel_id as apparel_Id, students.first_name as name, students.uin as uin, rentals.checkout_date as checkout_date,  rentals.expected_return_date as expected_return_date, rentals.actual_return_date as actual_return_date, rentals.student_id as student_id, rentals.extension_count as extension_count").where("rentals.id = ? and (rentals.actual_return_date is NULL or rentals.checkout_date > ?)", params[:id], Date.today-7)
      end

      # Never trust parameters from the scary internet, only allow the white list through.
      def rental_params
        params.require(:rental).permit(:uin, :apparel_id, :checkout_date, :expected_return_date, :actual_return_date, :student_id)
      end
  end
end
