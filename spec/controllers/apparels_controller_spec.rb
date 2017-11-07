require 'rails_helper'

RSpec.describe V1::ApparelsController, type: :controller do
  describe "GET #show" do
    it "Returns the correct apparel details" do
	  apparel = FactoryGirl.create(:apparel, :apparel_id => "1A")
	  get :show, params: { id: "1A" }
	  json = JSON.parse(response.body)
      expect(json["success"]).to eq(true)
	  expect(json["data"]["apparel_id"]).to eq("1A")	  
    end
	it "Returns the error if apparel ID not present" do
	  get :show, params: { id: "2A" }
	  json = JSON.parse(response.body)
      expect(json["success"]).to eq(false)
	  expect(json["message"]).to eq("Sorry, Apparel record not found.")
    end
  end

  describe "GET #index" do
    it "Returns all the apparel details" do
	  apparel = FactoryGirl.create(:apparel, :apparel_id => "1A")
	  get :index
	  json = JSON.parse(response.body)
      expect(json["success"]).to eq(true)
	  expect(json["data"][0]["apparel_id"]).to eq("1A")	  
    end
  end

  describe "GET #bysize" do
    it "Returns the correct apparel details filtered by size" do
	  apparel = FactoryGirl.create(:apparel, :apparel_id => "1A")
          apparel2 = FactoryGirl.create(:apparel2, :apparel_id => "2A")
	  get :bysize, params: { size: ["M","L"] }
	  json = JSON.parse(response.body)
      expect(json["success"]).to eq(true)
	  expect(json["data"][0]["apparel_id"]).to eq("1A")	  
    end
	it "Returns the error if size not present" do
          apparel = FactoryGirl.create(:apparel, :apparel_id => "1A")
          apparel2 = FactoryGirl.create(:apparel2, :apparel_id => "2A")
	  get :bysize, params: { size: ["XS","XL"] }
	  json = JSON.parse(response.body)
      expect(json["success"]).to eq(true)
	  expect(json["message"]).to eq("Sorry, Record not found.")
    end
  end

  describe "GET #getsize" do
    it "Returns all the apparel sizes" do
	  apparel = FactoryGirl.create(:apparel, :apparel_id => "1A")
          apparel2 = FactoryGirl.create(:apparel2, :apparel_id => "2A")
          get :get_sizes
	  json = JSON.parse(response.body)
      	  expect(json["success"]).to eq(true)
	  expect(json["data"]["sizes"][0]).to eq("L")
          expect(json["data"]["sizes"][1]).to eq("M")	  
    end
  end



describe "GET #bysize_and_stock" do
    it "Returns the correct apparel details filtered by size and available stock" do
	  apparel = FactoryGirl.create(:apparel, :apparel_id => "1A")
          apparel2 = FactoryGirl.create(:apparel2, :apparel_id => "2A")
          student = FactoryGirl.create(:student, :uin => 100)
          rental = FactoryGirl.create(:rental, :student_id => student.id, :apparel_id => apparel.id)
          get :bysize_and_stock, params: { stock: 0, size: ["M"]}
	  json = JSON.parse(response.body)
      	  expect(json["success"]).to eq(true)
	  expect(json["data"][0]["apparelId"]).to eq("2A")  
    end
    it "Returns the correct apparel details filtered by size and checked out stock" do
          apparel = FactoryGirl.create(:apparel, :apparel_id => "1A")
          student = FactoryGirl.create(:student, :uin => 100)
          rental = FactoryGirl.create(:rental, :student_id => student.id, :apparel_id => apparel.id)
	  get :bysize_and_stock, params: { stock: 1, size: ["L"] }
	  json = JSON.parse(response.body)
      	  expect(json["success"]).to eq(true)
	  expect(json["data"][0]["apparelId"]).to eq("1A")	  
    end
    it "Returns the error if size not present" do
          apparel = FactoryGirl.create(:apparel, :apparel_id => "1A")
          student = FactoryGirl.create(:student, :uin => 100)
          rental = FactoryGirl.create(:rental, :student_id => student.id, :apparel_id => apparel.id)
	  get :bysize_and_stock, params: { stock: 1, size: ["XL"] }
	  json = JSON.parse(response.body)
          expect(json["success"]).to eq(true)
	  expect(json["message"]).to eq("Sorry, Record not found.")
    end
  end



  describe "GET #getstock" do
    it "Returns all the available" do
	  apparel = FactoryGirl.create(:apparel, :apparel_id => "1A")
          apparel2 = FactoryGirl.create(:apparel2, :apparel_id => "2A")
          student = FactoryGirl.create(:student, :uin => 100)
          rental = FactoryGirl.create(:rental, :student_id => student.id, :apparel_id => apparel.id)
          get :get_stock, params: { stock: 0 }
	  json = JSON.parse(response.body)
      	  expect(json["success"]).to eq(true)
	  expect(json["data"][0]["apparelId"]).to eq("2A")	  
    end
    it "Returns error saying that no available stock" do
	  apparel = FactoryGirl.create(:apparel, :apparel_id => "1A")
          apparel2 = FactoryGirl.create(:apparel2, :apparel_id => "2A")
          student = FactoryGirl.create(:student, :uin => 100)
          rental = FactoryGirl.create(:rental, :rental_id => 2, :student_id => student.id, :apparel_id => apparel.id)
          rental = FactoryGirl.create(:rental, :rental_id => 3, :student_id => student.id, :apparel_id => apparel2.id)
          get :get_stock, params: { stock: 0 }
	  json = JSON.parse(response.body)
      	  expect(json["success"]).to eq(true)
	  expect(json["message"]).to eq("Sorry, Record not found.")	  
    end
    it "Returns all the checked out stock" do
	  apparel = FactoryGirl.create(:apparel, :apparel_id => "1A")
          student = FactoryGirl.create(:student, :uin => 100)
          rental = FactoryGirl.create(:rental, :student_id => student.id, :apparel_id => apparel.id)
          get :get_stock, params: { stock: 1 }
	  json = JSON.parse(response.body)
      	  expect(json["success"]).to eq(true)
	  expect(json["data"][0]["apparelId"]).to eq("1A")
    end
    it "Returns error saying that no checked out stock" do
	  apparel = FactoryGirl.create(:apparel, :apparel_id => "1A")
 
          get :get_stock, params: { stock: 1 }
	  json = JSON.parse(response.body)
      	  expect(json["success"]).to eq(true)
	  expect(json["message"]).to eq("Sorry, Record not found.")	  
    end
  end



  describe "DELETE #destroy" do
    it "Deletes the correct apparel details" do
	  apparel = FactoryGirl.create(:apparel, :apparel_id => "1A")
	  delete :destroy, params: { id: "1A" }
	  json = JSON.parse(response.body)
      expect(json["success"]).to eq(true)
	  expect(json["message"]).to eq("Apparel record destroyed successfuly.")	  
    end
	it "Returns the error if apparel ID not present" do
	  delete :destroy, params: { id: "2A" }
	  json = JSON.parse(response.body)
      expect(json["success"]).to eq(false)
	  expect(json["message"]).to eq("Sorry, Apparel record not found.")
    end
  end  
  
  describe "POST #create" do
    it "Creates the apparel record" do
	  apparel_attr = FactoryGirl.attributes_for :apparel
	  jsonrequest={ 'apparel': apparel_attr, format: :json }
	  post :create, params: jsonrequest
	  json = JSON.parse(response.body)
      expect(json["success"]).to eq(true)
	  expect(json["message"]).to eq("Apparel record created successfuly.")	  
    end
	it "Returns error saying apparel ID already exists" do
	  apparel = FactoryGirl.create(:apparel)
	  apparel_attr = FactoryGirl.attributes_for :apparel
	  jsonrequest={ 'apparel': apparel_attr, format: :json }
	  post :create, params: jsonrequest
	  json = JSON.parse(response.body)
      expect(json["success"]).to eq(false)
	  expect(json["message"]).to eq("Validation failed: Apparel has already been taken")	  
    end
  end
  
  describe "PUT #update" do
    it "Updates the apparel record" do
	  apparel = FactoryGirl.create(:apparel, :apparel_id => "1A")
	  apparel_attr = FactoryGirl.attributes_for :update_apparel
	  jsonrequest={id: "1A", 'apparel': apparel_attr, format: :json }
	  put :update, params: jsonrequest
	  json = JSON.parse(response.body)
      expect(json["success"]).to eq(true)
	  expect(json["message"]).to eq("Apparel record updated successfuly.")	  
    end
	it "Return saying that UIN doesn't exist the apparel record" do
	  apparel = FactoryGirl.create(:apparel, :apparel_id => "1A")
	  apparel_attr = FactoryGirl.attributes_for :update_apparel
	  jsonrequest={id: "2A", 'apparel': apparel_attr, format: :json }
	  put :update, params: jsonrequest
	  json = JSON.parse(response.body)
      expect(json["success"]).to eq(false)
	  expect(json["message"]).to eq("Sorry, Apparel record not found.")	  
    end
  end  
end
