class Constant < ApplicationRecord
  validates :key, presence: true, uniqueness: true

  def self.find_value(key)
    Constant.where(key: key).first.value
  end
end