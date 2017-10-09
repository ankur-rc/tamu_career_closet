require 'rails_helper'

RSpec.describe Student, :type => :model do
  subject {
    described_class.new(uin: 123, first_name: "ABC", last_name: "DEF",
                      email: "xyz@email", phone: "1234")
  }
  it "is valid with valid attributes"do
    expect(subject).to be_valid
  end
  it "is not valid without a uin" do
    subject.uin = nil
    expect(subject).to_not be_valid
  end
  it "is not valid without a first name" do
    subject.first_name = nil
    expect(subject).to_not be_valid
  end
  it "is not valid without a email" do
    subject.email = nil
    expect(subject).to_not be_valid
  end
  it "is not valid without a phone" do
    subject.phone = nil
    expect(subject).to_not be_valid
  end
end
