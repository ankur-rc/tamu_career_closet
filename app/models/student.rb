class Student < ApplicationRecord
  has_many :rentals

  validates :uin, presence: true, uniqueness: true
  validates :first_name, presence: true
  validates :email, presence: true
  validates :phone, presence: true
end
