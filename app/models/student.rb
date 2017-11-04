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

end
