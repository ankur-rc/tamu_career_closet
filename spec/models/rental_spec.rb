require 'rails_helper'
  
RSpec.describe Rental, :type => :model do
  let(:student) { Student.create(uin: 123, first_name: "ABC", last_name: "DEF",
                                email: "xyz@email", phone: "1234") }
  let(:apparel) { Apparel.create(apparel_id: "0000", sex: "M",
                                article: "Pant", size: "undefined", notes: "Nothing") }
  subject {
    described_class.new(apparel_id: apparel.id, checkout_date: '2017-10-03 15:19:49',
                        expected_return_date: '2017-10-03 15:19:49', actual_return_date: '2017-10-03 15:19:49',
                        student_id: student.id )
  }
  it "is valid with valid attributes"do
    expect(subject).to be_valid
  end
  it "is not valid without a apparel id" do
    subject.apparel_id= nil
    expect(subject).to_not be_valid
  end
  it "is not valid without a checkout date" do
    subject.checkout_date= nil
    expect(subject).to_not be_valid
  end
  it "is not valid without an expected return date " do
    subject.expected_return_date = nil
    expect(subject).to_not be_valid
  end

  it "is not valid without a student id" do
    subject.student_id = nil
    expect(subject).to_not be_valid
  end
end
