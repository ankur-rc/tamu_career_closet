class CreateApparels < ActiveRecord::Migration[5.1]
  def change
    create_table :apparels do |t|
      t.string :apparel_id
      t.string :sex
      t.string :article
      t.string :size
      t.string :notes

      t.timestamps
    end
  end
end
