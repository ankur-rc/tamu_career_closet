require 'csv'

class Rental < ApplicationRecord
  belongs_to :apparel
  belongs_to :student

  validates :apparel_id, presence: true
  validates :checkout_date, presence: true
  validates :expected_return_date, presence: true
  validates :student_id, presence: true

  def self.to_csv
    rental_attributes = %w{
        RentalID StudentName UIN ApparelID ApparelSize CheckoutDate ExpectedReturnDate ActualReturnDate}
    rentals_this_week = where(checkout_date: 1.week.ago.to_date..Date.today)

    defaulter_attributes = %w{
        RentalID StudentName UIN ApparelID ApparelSize CheckoutDate ExpectedReturnDate}
    defaulters_list = where('
        expected_return_date <= ? and actual_return_date IS NULL', Date.today)

    CSV.generate(headers: true) do |csv|
      csv << ['Audit Report', 1.week.ago.to_date, Date.today]

      csv << [nil, nil] << [nil, nil] << ['Rentals', rentals_this_week.count]

      csv << [nil, nil] << rental_attributes
      rentals_this_week.each do |rental|
        csv << [rental.id, rental.student.first_name, rental.student.uin,
            rental.apparel.id, rental.apparel.size, rental.checkout_date.to_date,
            rental.expected_return_date.to_date, rental.actual_return_date]
      end

      csv << [nil, nil] << [nil, nil] << ['Defaulters', defaulters_list.count]

      csv << [nil, nil] << defaulter_attributes
      defaulters_list.each do |defaulter|
        csv << [defaulter.id, defaulter.student.first_name, defaulter.student.uin,
            defaulter.apparel.id, defaulter.apparel.size, defaulter.checkout_date.to_date,
            defaulter.expected_return_date.to_date]
      end
    end
  end

  def self.determine_ApparelCheckedOut(apparelId)
	countOfCheckedOut=Apparel.joins(:rentals).where("rentals.actual_return_date is NULL and apparels.apparel_id=?",apparelId).count
	if countOfCheckedOut>0
           return true
        else
	   return false
	end
  end
end
