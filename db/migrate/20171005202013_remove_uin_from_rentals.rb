class RemoveUinFromRentals < ActiveRecord::Migration[5.1]
  def change
    remove_column :rentals, :uin
  end
end
