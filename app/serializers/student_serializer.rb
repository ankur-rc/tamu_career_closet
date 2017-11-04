class StudentSerializer < ActiveModel::Serializer
  attributes :id, :uin, :first_name, :created_at, :updated_at
end
