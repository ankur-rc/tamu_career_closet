require 'rails_helper'

RSpec.describe V1::StudentsController, type: :controller do
  describe "GET #show" do
    it "Returns the correct student details" do
	  student = FactoryGirl.create(:student, :uin => 100)
	  get :show, params: { id: 100 }
	  json = JSON.parse(response.body)
      expect(json["success"]).to eq(true)
	  expect(json["data"]["uin"]).to eq(100)	  
    end
	it "Returns the error if UIN not present" do
	  get :show, params: { id: 120 }
	  json = JSON.parse(response.body)
      expect(json["success"]).to eq(false)
	  expect(json["message"]).to eq("Sorry, Student record not found.")
    end
  end

  describe "GET #index" do
    it "Returns all the student details" do
	  student = FactoryGirl.create(:student, :uin => 100)
	  get :index
	  json = JSON.parse(response.body)
      expect(json["success"]).to eq(true)
	  expect(json["data"][0]["uin"]).to eq(100)	  
    end
  end

  describe "DELETE #destroy" do
    it "Deletes the correct student details" do
	  student = FactoryGirl.create(:student, :uin => 100)
	  delete :destroy, params: { id: 100 }
	  json = JSON.parse(response.body)
      expect(json["success"]).to eq(true)
	  expect(json["message"]).to eq("Student record destroyed successfuly.")	  
    end
    it "Returns error saying that the student has an apparel checked out" do
    apparel = FactoryGirl.create(:apparel, id: 1)
    student = FactoryGirl.create(:student, uin: 100, id: 100)
    rental = FactoryGirl.create(:rental, id: 1, apparel_id: 1, student_id: 100)
    delete :destroy, params: { id: student.uin }
    json = JSON.parse(response.body)
      expect(json["success"]).to eq(false)
      expect(json["message"]).to eq("Student has unreturned rental associated with it.")    
    end
	it "Returns the error if UIN not present" do
	  delete :destroy, params: { id: 120 }
	  json = JSON.parse(response.body)
      expect(json["success"]).to eq(false)
	  expect(json["message"]).to eq("Sorry, Student record not found.")
    end
  end  
  
  describe "POST #create" do
    it "Creates the student record" do
	  student_attr = FactoryGirl.attributes_for :student
	  jsonrequest={ 'student': student_attr, format: :json }
	  post :create, params: jsonrequest
	  json = JSON.parse(response.body)
      expect(json["success"]).to eq(true)
	  expect(json["message"]).to eq("Student record created successfuly.")	  
    end
	it "Returns saying UIN already exists" do
	  student = FactoryGirl.create(:student)
	  student_attr = FactoryGirl.attributes_for :student
	  jsonrequest={ 'student': student_attr, format: :json }
	  post :create, params: jsonrequest
	  json = JSON.parse(response.body)
      expect(json["success"]).to eq(false)
	  expect(json["message"]).to eq("Validation failed: Uin has already been taken")	  
    end
  end
  
  describe "PUT #update" do
    it "Updates the student record" do
	  student = FactoryGirl.create(:student, :uin => 17)
	  student_attr = FactoryGirl.attributes_for :update_student
	  jsonrequest={id: 17, 'student': student_attr, format: :json }
	  put :update, params: jsonrequest
	  json = JSON.parse(response.body)
      expect(json["success"]).to eq(true)
	  expect(json["message"]).to eq("Student record updated successfuly.")	  
    end
	it "Return saying that UIN doesn't exist the student record" do
	  student = FactoryGirl.create(:student, :uin => 17)
	  student_attr = FactoryGirl.attributes_for :update_student
	  jsonrequest={id: 100, 'student': student_attr, format: :json }
	  put :update, params: jsonrequest
	  json = JSON.parse(response.body)
      expect(json["success"]).to eq(false)
	  expect(json["message"]).to eq("Sorry, Student record not found.")	  
    end
  end  
end
