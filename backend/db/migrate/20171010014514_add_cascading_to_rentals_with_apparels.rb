class AddCascadingToRentalsWithApparels < ActiveRecord::Migration[5.1]
  def change
    remove_foreign_key :rentals, :apparels
    add_foreign_key :rentals, :apparels, on_delete: :cascade, on_update: :cascade
  end
end
