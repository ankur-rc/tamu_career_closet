class CreateRentals < ActiveRecord::Migration[5.1]
  def change
    create_table :rentals do |t|
      t.integer :rental_id
      t.integer :uin
      t.references :apparel, foreign_key: true
      t.datetime :checkout_date
      t.datetime :expected_return_date
      t.datetime :actual_return_date
      t.references :student, foreign_key: true

      t.timestamps
    end
  end
end
