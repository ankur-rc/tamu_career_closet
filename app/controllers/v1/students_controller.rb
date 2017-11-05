module V1
  class StudentsController < ApplicationController
    skip_before_action :authorize_request
    before_action :set_student, only: [:show, :edit, :update, :destroy]
  
    # GET /students
    # GET /students.json
    def index
      @students = Student.all
      json_response({success: true, data: @students},:ok)
    end

    # GET /students/1
    # GET /students/1.json
    def show
      if @student.empty?()
        # msg = { :status => :unprocessable_entity, :message => "Record doesn't exist"}
        # render :json => msg
        json_response({success: false, message: Message.not_found('Student record')},:unprocessable_entity)
      else
        # msg = { :status => :shown, :message => "Success", :studentrecord => @student}
        # render :json => msg
        json_response({success: true, data: @student[0]},:ok)
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
      Student.create!(student_params)
      json_response({success: true, message: Message.created_successfuly('Student record')},:created)  
      # @student = Student.new(student_params)
      # if @student.save
      #   # msg = { :status => :created, :message => "Student was successfully created."}
      #   # render :json => msg
      # else
      #   # msg = { :status => :unprocessable_entity, :message => @student.errors}
      #   # render :json => msg
      # end
    end

    # PATCH/PUT /students/1
    # PATCH/PUT /students/1.json
    def update
      if @student.empty?()
        # msg = { :status => :unprocessable_entity, :message => "Record doesn't exist"}
        # render :json => msg
        json_response({success: false, message: Message.not_found('Student record')},:unprocessable_entity)
      else
        # if @student.update(student_params)
        #   msg = { :status => :updated, :message => "Student was successfully updated."}
        #   render :json => msg
        # else
        #   msg = { :status => :unprocessable_entity, :message => @student.errors}
        #   render :json => msg
        # end
        Student.update(student_params)
        json_response({success: true, message: Message.updated_successfuly('Student record')},:ok)
      end
    end

    # DELETE /students/1
    # DELETE /students/1.json
    def destroy
      if @student.empty?()
        # msg = { :status => :unprocessable_entity, :message => "Record doesn't exist"}
        # render :json => msg
        json_response({success: false, message: Message.not_found('Student record')},:unprocessable_entity)
      else
        if Student.destroy(@student.first.id)
            # msg = { :status => :deleted, :message => "Student was successfully deleted."}
            # render :json => msg
            json_response({success: true, message: Message.destroyed_successfuly('Student record')},:ok) 
        else
            # msg = { :status => :unprocessable_entity, :message => @student.errors}
            # render :json => msg
            json_response({success: true, message: @student.errors},:ok)
        end
      end
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_student
        @student = Student.where(:uin => params[:id])
      end

      # Never trust parameters from the scary internet, only allow the white list through.
      def student_params
        params.require(:student).permit(:uin, :first_name, :last_name, :email, :phone)
      end
  end
end
