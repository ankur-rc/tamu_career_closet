module V1 
  class UsersController < ApplicationController
    skip_before_action :authorize_request, only: :create
    # POST /signup
    # return authenticated token upon signup
    def create
      User.create!(user_params)
      # auth_token = AuthenticateUser.new(user.email, user.password).call
      response = { success:true, message: Message.account_created}
      json_response(response, :created)
    end

    # def forgot_password
    #   @user = User.where(:username => params[:username])
    #   PendingMailer.mailer_forgot_password(username, @rental["password_digest"]); 
    #   if @user.empty?()
    #     json_response({success: false, message: Message.not_found('User record')}, :unprocessable_entity)
    #   else
    #     @user.update(student_params)
    #     json_response({success: true, message: Message.updated_successfuly('User record')}, :ok)
    #   end
    # end
    # PATCH/PUT /users/1
    # PATCH/PUT /users/1.json
    # def update
    #   if @student.empty?()
    #     json_response({success: false, message: Message.not_found('User record')}, :unprocessable_entity)
    #   else
    #     @student.update(student_params)
    #     json_response({success: true, message: Message.updated_successfuly('User record')}, :ok)
    #   end
    # end

    # GET /students/1
    # GET /students/1.json
    # def show
    #   if @user.empty?()
    #     json_response({success: false, message: Message.not_found('User record')}, :unprocessable_entity)
    #   else
    #     json_response({success: true, data: @user[0]}, :ok)
    #   end
    # end

    private

    def user_params
      params.permit(
        :name,
        :email,
        :password,
        :password_confirmation
      )
    end
    # Use callbacks to share common setup or constraints between actions.
    # def set_user
    #   @user = User.where(:id => params[:id])
    # end
  end
end
