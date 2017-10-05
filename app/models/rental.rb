class Rental < ApplicationRecord
  belongs_to :apparel
  belongs_to :student
end
