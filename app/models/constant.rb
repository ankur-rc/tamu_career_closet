class Constant < ApplicationRecord

 def self.findValue(keyValue)
    return Constant.where(:key=>keyValue).first.value
  end
end