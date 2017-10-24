FactoryGirl.define do
  factory :student do
    uin 1
    first_name "MyString"
    last_name "MyString"
    email "MyString"
    phone "MyString"
  end
  
  factory :update_student, parent: :student do
    uin 1
    first_name "MyNewString"
    last_name "MyNewString"
    email "MyNewString"
    phone "MyNewString"
  end
end
