class Apparel < ApplicationRecord
  has_many :rentals, dependent: :destroy

  validates :apparel_id, presence: true, uniqueness: true
end
