class AddCascadingToRentals < ActiveRecord::Migration[5.1]
  def change
		remove_foreign_key :rentals, :students
  	add_foreign_key :rentals, :students, on_delete: :cascade, on_update: :cascade
  end
end
