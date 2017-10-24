class StudentsController < ApplicationController
  skip_before_action :authorize_request
  before_action :set_student, only: [:show, :edit, :update, :destroy]
 
  # GET /students
  # GET /students.json
  def index
    @students = Student.all
  end

  # GET /students/1
  # GET /students/1.json
  def show
    if @student.empty?()
	  msg = { :status => :unprocessable_entity, :message => "Record doesn't exist"}
	  render :json => msg
	else
      msg = { :status => :shown, :message => "Success", :studentrecord => @student}
	  render :json => msg
	end
  end
  

  # GET /students/new
  def new
    @student = Student.new
  end

  # GET /students/1/edit
  def edit
  end

  def home
  end

  
  # POST /students
  # POST /students.json
  def create  
    @student = Student.new(student_params)
    if @student.save
      msg = { :status => :created, :message => "Student was successfully created."}
	  render :json => msg
    else
      msg = { :status => :unprocessable_entity, :message => @student.errors}
 	  render :json => msg
    end
  end

  # PATCH/PUT /students/1
  # PATCH/PUT /students/1.json
  def update
    if @student.empty?()
	  msg = { :status => :unprocessable_entity, :message => "Record doesn't exist"}
	  render :json => msg
	else
      if @student.update(student_params)
        msg = { :status => :updated, :message => "Student was successfully updated."}
	    render :json => msg
      else
        msg = { :status => :unprocessable_entity, :message => @student.errors}
		render :json => msg
	  end
	end
  end

  # DELETE /students/1
  # DELETE /students/1.json
  def destroy
    if @student.empty?()
	  msg = { :status => :unprocessable_entity, :message => "Record doesn't exist"}
	  render :json => msg
	else
	  if @student.destroy_all
          msg = { :status => :deleted, :message => "Student was successfully deleted."}
	      render :json => msg
	  else
        msg = { :status => :unprocessable_entity, :message => @student.errors}
		ender :json => msg
	  end
	end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_student
      @student = Student.where(uin:params[:uin])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def student_params
      params.require(:student).permit(:uin, :first_name, :last_name, :email, :phone)
    end
end
