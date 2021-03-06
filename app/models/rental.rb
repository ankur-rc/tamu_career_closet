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
        RentalID StudentName UIN ApparelID ApparelSize CheckoutDate ExpectedReturnDate ActualReturnDate ExtensionCount}
    rentals_this_week = where(checkout_date: 1.week.ago.to_date..Date.tomorrow)

    extension_attributes = %w{
        RentalID StudentName UIN ApparelID ApparelSize CheckoutDate ExpectedReturnDate ExtensionCount}
    extension_list = where('checkout_date < ? and expected_return_date >= ? and
        actual_return_date IS NULL', 1.week.ago.to_date, Date.today)

    defaulter_attributes = %w{
        RentalID StudentName UIN ApparelID ApparelSize CheckoutDate ExpectedReturnDate ExtensionCount}
    defaulters_list = where('
        expected_return_date < ? and actual_return_date IS NULL', Date.today)

    CSV.generate(headers: true) do |csv|
      csv << ['Audit Report', 1.week.ago.to_date, Date.today]

      csv << [nil, nil] << [nil, nil] << ['Rentals', rentals_this_week.count]

      csv << rental_attributes
      rentals_this_week.each do |rental|
        csv << [rental.id, rental.student.first_name, rental.student.uin,
            rental.apparel.apparel_id, rental.apparel.size, rental.checkout_date.to_date,
            rental.expected_return_date.to_date, rental.actual_return_date,
            rental.extension_count]
      end

      csv << [nil, nil] << [nil, nil] << ['Extended Rentals', extension_list.count]

      csv << extension_attributes
      extension_list.each do |extension|
        csv << [extension.id, extension.student.first_name, extension.student.uin,
            extension.apparel.apparel_id, extension.apparel.size, extension.checkout_date.to_date,
            extension.expected_return_date.to_date, extension.extension_count]
      end

      csv << [nil, nil] << [nil, nil] << ['Defaulters', defaulters_list.count]

      csv << defaulter_attributes
      defaulters_list.each do |defaulter|
        csv << [defaulter.id, defaulter.student.first_name, defaulter.student.uin,
            defaulter.apparel.apparel_id, defaulter.apparel.size, defaulter.checkout_date.to_date,
            defaulter.expected_return_date.to_date, defaulter.extension_count]
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

  def self.is_rental_checked_out(rentalId)
    countOfCheckedOut = Rental.where("id = ? and actual_return_date is NULL", rentalId).count
    if countOfCheckedOut == 0
      return false
    else
      return true
    end
  end

  def self.increment_extension_count(rentalId, checkout_days)
    @rentalrecord = Rental.where("id = ?", rentalId)
    current_extension_count = @rentalrecord[0]["extension_count"]
    current_expected_return_date = @rentalrecord[0]["expected_return_date"]
    @rentalrecord.update(expected_return_date: current_expected_return_date + checkout_days, extension_count: current_extension_count+1)
  end
 
end
