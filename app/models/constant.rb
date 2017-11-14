class Constant < ApplicationRecord

  def self.find_value(key)
    Constant.where(key: key).first.value
  end
end