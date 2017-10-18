class CreateConstants < ActiveRecord::Migration[5.1]
  def change
    create_table :constants do |t|
      t.string :key
      t.string :value
      t.datetime :created
      t.datetime :updated

      t.timestamps
    end
  end
end
