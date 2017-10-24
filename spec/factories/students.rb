FactoryGirl.define do
  factory :student do
    uin 1
    first_name "MyString"
    last_name "MyString"
    email "MyString"
    phone "MyString"
  end
  
  factory :nonexisting_student, parent: :student do
    uin 3
  end
  
  factory :invalid_student, parent: :student do
    uin nil
	first_name nil
	email nil
	phone nil
  end
end
