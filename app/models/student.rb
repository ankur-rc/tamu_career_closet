class Student < ApplicationRecord
  has_many :rentals, dependent: :destroy

  validates :uin, presence: true, uniqueness: true
  validates :first_name, presence: true
  validates :email, presence: true
  validates :phone, presence: true

  def self.by_uin(uin)
    student = Student.where(uin: uin).first
    if student == nil
      raise RecordNotFoundError.new(Response_Message::STUDENT_ENTRY_NOT_FOUND)
    end

    return student
  end

  def self.active_users
    active_id = Rental.select("student_id").where("actual_return_date is NULL")
    active_users = Student.select("
        uin, first_name as name, email,
        phone").where("id in (?)",active_id)
  end

end
