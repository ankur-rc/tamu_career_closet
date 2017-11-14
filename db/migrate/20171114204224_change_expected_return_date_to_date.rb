class ChangeExpectedReturnDateToDate < ActiveRecord::Migration[5.1]
  def change
    change_column :rentals, :expected_return_date, :date
  end
end
