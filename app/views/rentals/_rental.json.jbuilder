json.extract! rental, :id, :rental_id, :uin, :apparel_id, :checkout_date, :expected_return_date, :actual_return_date, :student_id, :created_at, :updated_at
json.url rental_url(rental, format: :json)
