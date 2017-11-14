class User < ApplicationRecord
    # encrypt password
    has_secure_password

    # Validations
    validates :email, presence: true, uniqueness: true
    validates_presence_of :name, :password_digest
end
