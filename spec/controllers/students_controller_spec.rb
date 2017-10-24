require 'rails_helper'

RSpec.describe StudentsController, type: :controller do
  describe "GET #show" do
    it "Returns the correct student details" do
	  student = FactoryGirl.create(:student, :uin => 100)
	  get :show, params: { uin: 100 }
	  json = JSON.parse(response.body)
      expect(json["status"]).to eq("shown")
	  expect(json["message"]).to eq("Success")
	  expect(json["studentrecord"][0]["uin"]).to eq(100)	  
    end
	it "Returns the error if UIN not present" do
	  get :show, params: { uin: 120 }
	  json = JSON.parse(response.body)
      expect(json["status"]).to eq("unprocessable_entity")
	  expect(json["message"]).to eq("Record doesn't exist")
    end
  end

  describe "GET #destroy" do
    it "Deletes the correct student details" do
	  student = FactoryGirl.create(:student, :uin => 100)
	  get :destroy, params: { uin: 100 }
	  json = JSON.parse(response.body)
      expect(json["status"]).to eq("deleted")
	  expect(json["message"]).to eq("Student was successfully deleted.")	  
    end
	it "Returns the error if UIN not present" do
	  get :destroy, params: { uin: 120 }
	  json = JSON.parse(response.body)
      expect(json["status"]).to eq("unprocessable_entity")
	  expect(json["message"]).to eq("Record doesn't exist")
    end
  end  
  
  describe "POST #create" do
    it "Creates the student record" do
	  student_attr = FactoryGirl.attributes_for :student
	  jsonrequest={ 'student': student_attr, format: :json }
	  post :create, params: jsonrequest
	  json = JSON.parse(response.body)
      expect(json["status"]).to eq("created")
	  expect(json["message"]).to eq("Student was successfully created.")	  
    end
	it "Returns saying UIN already exists" do
	  student = FactoryGirl.create(:student)
	  student_attr = FactoryGirl.attributes_for :student
	  jsonrequest={ 'student': student_attr, format: :json }
	  post :create, params: jsonrequest
	  json = JSON.parse(response.body)
      expect(json["status"]).to eq("unprocessable_entity")
	  expect(json["message"]["uin"][0]).to eq("has already been taken")	  
    end
  end
  
  describe "POST #update" do
    it "Updates the student record" do
	  student = FactoryGirl.create(:student)
	  student_attr = FactoryGirl.attributes_for :update_student
	  jsonrequest={ 'student': student_attr, 'uin': 1, format: :json }
	  post :update, params: jsonrequest
	  json = JSON.parse(response.body)
      expect(json["status"]).to eq("updated")
	  expect(json["message"]).to eq("Student was successfully updated.")	  
    end
	it "Return saying that UIN doesn't exist the student record" do
	  student = FactoryGirl.create(:student, :uin => 17)
	  student_attr = FactoryGirl.attributes_for :update_student
	  jsonrequest={ 'student': student_attr, 'uin': 1, format: :json }
	  post :update, params: jsonrequest
	  json = JSON.parse(response.body)
      expect(json["status"]).to eq("unprocessable_entity")
	  expect(json["message"]).to eq("Record doesn't exist")	  
    end
  end  
end
