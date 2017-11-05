class StudentSerializer < ActiveModel::Serializer
  attributes :id, :uin, :created_at, :updated_at
  has_many :rentals
end
