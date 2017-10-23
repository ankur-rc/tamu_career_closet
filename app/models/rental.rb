class Rental < ApplicationRecord
  belongs_to :apparel
  belongs_to :student

  validates :rental_id, presence: true, uniqueness: true
  validates :apparel_id, presence: true
  validates :checkout_date, presence: true
  validates :expected_return_date, presence: true
  validates :student_id, presence: true

  def self.getLastRentalId
    begin
      @lastCreatedRentalId=Rental.order('created_at DESC').first.rental_id.to_i
    rescue ActiveRecord::RecordNotFound

    end
    return @lastCreatedRentalId
  end
end
