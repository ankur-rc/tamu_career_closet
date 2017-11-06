class Student < ApplicationRecord
  has_many :rentals, dependent: :destroy

  validates :uin, presence: true, uniqueness: true
  validates :first_name, presence: true
  validates :email, presence: true
  validates :phone, presence: true


  def self.findStudentByUIN(studentUIN)
    begin
      @student=Student.where(:uin =>studentUIN).first
      if @student==nil
      raise RecordNotFoundError.new(Response_Message::STUDENT_ENTRY_NOT_FOUND)
      end
    end
    return @student
  end

  
  def self.active_users
	  @active_users = Student.joins(:rentals).select("
	    students.uin as uin, students.first_name as name, rentals.checkout_date").where("
		    rentals.actual_return_date is NULL AND rentals.checkout_date is NOT NULL").group("rentals.student_id")
	  return @active_users
	end
	
end
