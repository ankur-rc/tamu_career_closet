FactoryGirl.define do
    factory :rental do
      rental_id { Faker::Number.number(10) }
      apparel_id { Faker::Number.number(10) }
      checkout_date { Faker::Date.backward(8) }
      expected_return_date { Faker::Date.forward(1) }
      student_id { Faker::Number.number(10) }
    end
end