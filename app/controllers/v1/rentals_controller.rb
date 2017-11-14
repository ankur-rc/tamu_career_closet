require 'tempfile'

module V1
  class RentalsController < ApplicationController
    skip_before_action :authorize_request
    before_action :set_rental, only: [:show, :edit, :update, :destroy]

    # GET /rentals
    # GET /rentals.json
    def index
      @rentals = Rental.all
      json_response({success: true, data: @rentals}, :ok)
    end

    # GET /rentals/1
    # GET /rentals/1.json
    def show
      if @rental.empty?()
        json_response({success: false, message: Message.not_found('Rental record')}, :unprocessable_entity)
      else
        json_response({success: true, data: @rental[0]}, :ok)
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
          'expected_return_date < ? and actual_return_date IS NULL', DateTime.now).count()

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
      student = Student.by_uin(params[:uin])
      apparel = Apparel.by_apparel_id(params[:apparel_id])
      checkout_days = Constant.where(key: :noOfCheckoutDays).first.value.to_i
      @rental = Rental.new(apparel_id: apparel.id, checkout_date: Date.today(),
          expected_return_date: Date.today() + checkout_days, student_id: student.id)

      if @rental.save
        json_response({success:true, message: Message.assigned_success}, :ok)
      else
        json_response({success:false, message: @rental.errors}, :internal_server_error)
      end
    end

    def return_suit
      response = Hash.new()
      student = Student.by_uin(params[:uin])
      apparel = Apparel.by_apparel_id(params[:apparel_id])
      @rental = Rental.where("student_id=? and apparel_id=? and actual_return_date IS NULL",
            student.uin, apparel.id).order("id DESC").first

      if @rental.update(actual_return_date: DateTime.now())
        json_response({success:true, message: Message.success_response}, :ok)
      else
        json_response({success:false, message: @rental.errors}, :internal_server_error)
      end
    end

    def send_pending_emails
      response = Hash.new()
      pending_returns_view = Rental.joins(:student).where("actual_return_date IS NULL and ?
          < expected_return_date and DATEDIFF(expected_return_date,?) < 2",
          DateTime.now, DateTime.now).select(
              "students.uin as uin, students.first_name as name,students.email as email,
              rentals.checkout_date as checkoutDate,
              rentals.expected_return_date as expectedReturnDate,
              rentals.id as rentalid, students.id as studentid").collect

      pending_returns_view.each do |return_pending|
        PendingMailer.send_pending(return_pending["uin"], return_pending["name"],
            return_pending["email"], return_pending["checkoutDate"],
            return_pending["expectedReturnDate"]).deliver_now
      end

      json_response({success:true, message: Message.success_response}, :ok)
    end

    def send_overdue_emails
      response = Hash.new()
      overdue_emails_view=Rental.joins(:student).where('expected_return_date<? and
          actual_return_date IS NULL',DateTime.now).select(
              "students.uin as uin, students.first_name as name,students.email as email,
              rentals.checkout_date as checkoutDate,
              rentals.expected_return_date as expectedReturnDate,
              rentals.id as rentalid, students.id as studentid").collect

      overdue_emails_view.each do |overdue_email|
        PendingMailer.send_overdue(overdue_email["uin"], overdue_email["name"],
            overdue_email["email"], overdue_email["checkoutDate"],
            overdue_email["expectedReturnDate"]).deliver_now
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
        @rental = Rental.find(params[:id])
      end

      # Never trust parameters from the scary internet, only allow the white list through.
      def rental_params
        params.require(:rental).permit(:uin, :apparel_id, :checkout_date, :expected_return_date, :actual_return_date, :student_id)
      end
  end
end
