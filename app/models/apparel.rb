class Apparel < ApplicationRecord
  has_many :rentals

  validates :apparel_id, presence: true, uniqueness: true
end
