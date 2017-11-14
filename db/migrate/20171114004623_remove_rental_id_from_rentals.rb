class RemoveRentalIdFromRentals < ActiveRecord::Migration[5.1]
  def change
    remove_column :rentals, :rental_id, :integer
  end
end
