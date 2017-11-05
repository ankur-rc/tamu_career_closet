class ApparelSerializer < ActiveModel::Serializer
  attributes :id, :apparel_id, :created_at, :updated_at
  has_many :rentals
end
