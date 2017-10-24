require 'rails_helper'

RSpec.describe Apparel, :type => :model do
  subject {
    described_class.new(apparel_id: "0000", sex: "M",
                      article: "Pant", size: "undefined", notes: "Nothing")
  }
  it "is valid with valid attributes"do
    expect(subject).to be_valid
  end
  it "is not valid without a apparel id" do
    subject.apparel_id = nil
    expect(subject).to_not be_valid
  end
end
