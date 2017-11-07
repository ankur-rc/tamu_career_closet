FactoryGirl.define do
    factory :rental do
      rental_id 1
      apparel_id 1
      checkout_date { Faker::Date.backward(8) }
      expected_return_date { Faker::Date.forward(1) }
      student_id 1
    end
end
