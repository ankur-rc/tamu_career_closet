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
    it "Returns error saying that the rental is not yet closed" do
    apparel = FactoryGirl.create(:apparel, id: 1)
    student = FactoryGirl.create(:student, uin: 100, id: 100)
    rental = FactoryGirl.create(:rental, id: 1, apparel_id: 1, student_id: 100)
    delete :destroy, params: { id: 1 }
    json = JSON.parse(response.body)
      expect(json["success"]).to eq(false)
      expect(json["message"]).to eq("ID has unreturned rental associated with it.")    
    end
    it "Deletes the rental successfully" do
    apparel = FactoryGirl.create(:apparel, id: 1)
    student = FactoryGirl.create(:student, uin: 100, id: 100)
    rental = FactoryGirl.create(:rental, id: 1, apparel_id: 1, student_id: 100)
    jsonrequest={ 'apparel_id': apparel.apparel_id, 'uin': student.uin, format: :json }
    post :return_suit, params: jsonrequest
    delete :destroy, params: { id: rental.id }
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

  describe "PUT #update" do
    it "Updates the rental details" do
    apparel = FactoryGirl.create(:apparel, :apparel_id => "1A")
    apparel2 = FactoryGirl.create(:apparel2, :apparel_id => "2A")
    student = FactoryGirl.create(:student, uin: 100, id: 100)
    rental = FactoryGirl.create(:rental, id: 1, apparel_id: apparel.id, student_id: student.id)
    rental2_attr = FactoryGirl.attributes_for :update_rental
    jsonrequest={id: 1, 'rental': rental2_attr, format: :json }
    put :update, params: jsonrequest
    json = JSON.parse(response.body)
    expect(json["success"]).to eq(true)
    expect(json["message"]).to eq("Rental record updated successfuly.")    
    end
    it "Return saying that rental doesn't exist" do
    apparel = FactoryGirl.create(:apparel, id: 1)
    student = FactoryGirl.create(:student, uin: 100, id: 100)
    rental = FactoryGirl.create(:rental, id: 1, apparel_id: 1, student_id: 100)
    rental2_attr = FactoryGirl.attributes_for :update_rental
    jsonrequest={id: 2, 'rental': rental2_attr, format: :json }
    put :update, params: jsonrequest
    json = JSON.parse(response.body)
    expect(json["success"]).to eq(false)
    expect(json["message"]).to eq("Sorry, Rental record not found.")
    end
end

  describe "POST #create" do
    it "Creates the rental entry" do
    apparel = FactoryGirl.create(:apparel, :apparel_id => "1A", id: 200)
    student = FactoryGirl.create(:student, uin: 100, id: 100)
    rental = FactoryGirl.attributes_for :create_rental
    jsonrequest={'rental': rental, format: :json }
    post :create, params: jsonrequest
    json = JSON.parse(response.body)
    expect(json["success"]).to eq(true)
    expect(json["message"]).to eq("Rental record created successfuly.")    
    end
    it "Return saying that apparel id doesn't exist" do
    apparel = FactoryGirl.create(:apparel, :apparel_id => "1A", id: 300)
    student = FactoryGirl.create(:student, uin: 100, id: 100)
    rental = FactoryGirl.attributes_for :create_rental
    jsonrequest={'rental': rental, format: :json }
    post :create, params: jsonrequest
    json = JSON.parse(response.body)
    expect(json["success"]).to eq(false)
    expect(json["message"]).to eq("Validation failed: Apparel must exist")
    end
    it "Return saying that student id doesn't exist" do
    apparel = FactoryGirl.create(:apparel, :apparel_id => "1A", id: 200)
    student = FactoryGirl.create(:student, uin: 100, id: 10)
    rental = FactoryGirl.attributes_for :create_rental
    jsonrequest={'rental': rental, format: :json }
    post :create, params: jsonrequest
    json = JSON.parse(response.body)
    expect(json["success"]).to eq(false)
    expect(json["message"]).to eq("Validation failed: Student must exist")
    end
end

  describe "GET #view_active" do
    it "Displays the active users" do
    apparel = FactoryGirl.create(:apparel, :apparel_id => "1A")
    student = FactoryGirl.create(:student, uin: 100, id: 100)
    rental = FactoryGirl.create(:rental, id: 1, apparel_id: apparel.id, student_id: student.id)
    get :view_active_user
    json = JSON.parse(response.body)
    expect(json["success"]).to eq(true)
    expect(json["data"][0]["uin"]).to eq(100)    
    end
end

  describe "GET #view_checked_out" do
    it "Displays the active users" do
    apparel = FactoryGirl.create(:apparel, :apparel_id => "1A")
    student = FactoryGirl.create(:student, uin: 100, id: 100)
    rental = FactoryGirl.create(:rental, id: 1, apparel_id: apparel.id, student_id: student.id)
    get :view_checked_out
    json = JSON.parse(response.body)
    expect(json["success"]).to eq(true)
    expect(json["data"][0]["apparel_id"]).to eq("1A")    
    end
end

  describe "GET #pending_returns_and_defaulters" do
    it "Displays the count of pending returns and defaulters" do
    apparel = FactoryGirl.create(:apparel, :apparel_id => "1A")
    student = FactoryGirl.create(:student, uin: 100, id: 100)
    rental = FactoryGirl.create(:rental, id: 1, apparel_id: apparel.id, student_id: student.id)
    get :pending_returns_and_defaulters
    json = JSON.parse(response.body)
    expect(json["success"]).to eq(true)
    expect(json["data"]["pendingreturns"]).to eq(1)
    expect(json["data"]["defaulters"]).to eq(0)  
    end
end

  describe "GET #num_active_users_and_checked_out" do
    it "Displays the active users and checked out apparels count" do
    apparel = FactoryGirl.create(:apparel, :apparel_id => "1A")
    student = FactoryGirl.create(:student, uin: 100, id: 100)
    rental = FactoryGirl.create(:rental, id: 1, apparel_id: apparel.id, student_id: student.id)
    get :num_active_users_and_checked_out
    json = JSON.parse(response.body)
    expect(json["success"]).to eq(true)
    expect(json["data"]["activeusers"]).to eq(1)
    expect(json["data"]["checkedoutusers"]).to eq(1)      
    end
end

  describe "GET #pending_returns" do
    it "Displays the count of pending returns" do
    apparel = FactoryGirl.create(:apparel, :apparel_id => "1A")
    student = FactoryGirl.create(:student, uin: 100, id: 100)
    rental = FactoryGirl.create(:rental, id: 1, apparel_id: apparel.id, student_id: student.id)
    get :pending_returns
    json = JSON.parse(response.body)
    expect(json["success"]).to eq(true)
    expect(json["data"]).to eq(1)
    end
end
  
  describe "POST #assign_suit" do
    it "Assigns the apparel" do
    apparel = FactoryGirl.create(:apparel, :apparel_id => "1A", id: 200)
    student = FactoryGirl.create(:student, uin: 100, id: 100)
    const = FactoryGirl.create(:constant)
    jsonrequest={'uin': 100, 'apparel_id':"1A", format: :json }
    post :assign_suit, params: jsonrequest
    json = JSON.parse(response.body)
    expect(json["success"]).to eq(true)
    expect(json["message"]).to eq("Assigned succcessfuly")    
    end
    it "Return saying that apparel his already checked out" do
    apparel = FactoryGirl.create(:apparel, :apparel_id => "1A", id: 300)
    student = FactoryGirl.create(:student, uin: 100, id: 100)
    rental = FactoryGirl.create(:rental, id: 1, apparel_id: apparel.id, student_id: student.id)
    const = FactoryGirl.create(:constant)
    jsonrequest={'uin': 100, 'apparel_id':"1A", format: :json }
    post :assign_suit, params: jsonrequest
    json = JSON.parse(response.body)
    expect(json["success"]).to eq(false)
    expect(json["message"]).to eq("Apparel already checked out")
    end
end
  
  describe "POST #return_suit" do
    it "Returns the apparel" do
    apparel = FactoryGirl.create(:apparel, :apparel_id => "1A", id: 200)
    student = FactoryGirl.create(:student, uin: 100, id: 100)
    rental = FactoryGirl.create(:rental, id: 1, apparel_id: apparel.id, student_id: student.id)
    const = FactoryGirl.create(:constant)
    jsonrequest={'uin': 100, 'apparel_id':"1A", format: :json }
    post :return_suit, params: jsonrequest
    json = JSON.parse(response.body)
    expect(json["success"]).to eq(true)
    expect(json["message"]).to eq("Success")    
    end
    it "Return saying that apparel has not been checked out" do
    apparel = FactoryGirl.create(:apparel, :apparel_id => "1A", id: 300)
    student = FactoryGirl.create(:student, uin: 100, id: 100)
    const = FactoryGirl.create(:constant)
    jsonrequest={'uin': 100, 'apparel_id':"1A", format: :json }
    post :return_suit, params: jsonrequest
    json = JSON.parse(response.body)
    expect(json["success"]).to eq(false)
    expect(json["message"]).to eq("Suit was never assigned")
    end
end

  describe "GET #getstudent" do
    it "Returns the correct student details" do
    apparel = FactoryGirl.create(:apparel, :apparel_id => "1A", id: 300)
    student = FactoryGirl.create(:student, uin: 100, id: 100)
    rental = FactoryGirl.create(:rental, id: 1, apparel_id: apparel.id, student_id: student.id)
    get :getstudent, params: { apparel_id: "1A" }
    json = JSON.parse(response.body)
    expect(json["success"]).to eq(true)
    expect(json["data"][0]["id"]).to eq(100)    
    end
    it "Returns the error if apparel id is not present" do
    apparel = FactoryGirl.create(:apparel, :apparel_id => "1A", id: 300)
    get :getstudent, params: { apparel_id: "1A" }
    json = JSON.parse(response.body)
    expect(json["success"]).to eq(false)
    expect(json["message"]).to eq("Sorry, Rental record not found.")
    end
end

  describe "GET #send_pending_emails" do
    it "Sends emails to students with pending rentals" do
    apparel = FactoryGirl.create(:apparel, :apparel_id => "1A", id: 200)
    student = FactoryGirl.create(:student, uin: 100, id: 100)
    rental = FactoryGirl.create(:pending_rental, id: 1, apparel_id: apparel.id, student_id: student.id)
    constant1 = FactoryGirl.create(:pending_email_text)
    constant2 = FactoryGirl.create(:pending_email_sender)
    get :send_pending_emails
    json = JSON.parse(response.body)
    expect(json["success"]).to eq(true)
    expect(json["message"]).to eq("Success")    
    end
end
  
  describe "GET #send_overdue_emails" do
    it "Sends emails to students with overdue rentals" do
    apparel = FactoryGirl.create(:apparel, :apparel_id => "1A", id: 200)
    student = FactoryGirl.create(:student, uin: 100, id: 100)
    rental = FactoryGirl.create(:overdue_rental, id: 1, apparel_id: apparel.id, student_id: student.id)
    constant1 = FactoryGirl.create(:overdue_email_text)
    constant2 = FactoryGirl.create(:overdue_email_sender)
    get :send_overdue_emails
    json = JSON.parse(response.body)
    expect(json["success"]).to eq(true)
    expect(json["message"]).to eq("Success")    
    end
end

end
  
