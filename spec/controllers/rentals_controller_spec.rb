require 'rails_helper'

RSpec.describe V1::RentalsController, type: :controller do
  describe "GET #show" do
    it "Returns the correct rental details" do
    apparel = FactoryGirl.create(:apparel, id: 1)
    student = FactoryGirl.create(:student, uin: 100, id: 100)
    rental = FactoryGirl.create(:rental, id: 1, apparel_id: 1, student_id: 100)
    get :show, params: { id: 1 }
    json = JSON.parse(response.body)
      expect(json["success"]).to eq(true)
    expect(json["data"]["id"]).to eq(1)    
    end
  it "Returns the empty data if rental is not present" do
    get :show, params: { id: 100 }
    json = JSON.parse(response.body)
      expect(json["data"]).to eq(nil)
    end
  end

  describe "DELETE #destroy" do
    it "Deletes the correct rental details" do
    apparel = FactoryGirl.create(:apparel, id: 1)
    student = FactoryGirl.create(:student, uin: 100, id: 100)
    rental = FactoryGirl.create(:rental, id: 1, apparel_id: 1, student_id: 100)
    delete :destroy, params: { id: 1 }
    json = JSON.parse(response.body)
      expect(json["success"]).to eq(true)
      expect(json["message"]).to eq("Rental record destroyed successfuly.")    
    end
  it "Returns the empty data if rental is not present" do
    get :show, params: { id: 100 }
    json = JSON.parse(response.body)
      expect(json["data"]).to eq(nil)
    end
  end
end
