json.extract! student, :id, :uin, :first_name, :last_name, :email, :phone, :created_at, :updated_at
json.url student_url(student, format: :json)
