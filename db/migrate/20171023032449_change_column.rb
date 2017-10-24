class ChangeColumn < ActiveRecord::Migration[5.1]
  def up
    change_column :users, :role, :string, :default => "admin"
  end
end
