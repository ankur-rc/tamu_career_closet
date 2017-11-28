require 'date'

FactoryGirl.define do
    factory :rental do
      apparel_id 1
      checkout_date { Faker::Date.backward(8) }
      expected_return_date { Faker::Date.forward(1) }
      student_id 100
    end

    factory :update_rental,  parent: :rental do
      apparel_id 1
      checkout_date { Faker::Date.backward(7) }
      expected_return_date { Faker::Date.forward(1) }
      student_id 1
    end
    
    factory :create_rental, parent: :rental do
      apparel_id 200
      checkout_date { Faker::Date.backward(8) }
      expected_return_date { Faker::Date.forward(1) }
      student_id 100
    end

    factory :pending_rental, parent: :rental do
      apparel_id 200
      checkout_date { Faker::Date.backward(8) }
      expected_return_date { Faker::Date.between(Date.today, Date.today) }
      student_id 100
    end
    
    factory :overdue_rental, parent: :rental do
      apparel_id 300
      checkout_date { Faker::Date.backward(8) }
      expected_return_date { Faker::Date.backward(2) }
      student_id 150
    end
end
