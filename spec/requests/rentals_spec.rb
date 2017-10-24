require 'rails_helper'

RSpec.describe 'Rentals API', type: :request do
  # initialize test data 
  let!(:rentals) { create_list(:rental, 10) }
  let(:rental_id) { rentals.first.id }

  # Test suite for GET /rentals
  describe 'GET /rentals' do
    # make HTTP get request before each example
    before { get '/rentals' }
    it 'returns rentals' do
      # Note `json` is a custom helper to parse JSON responses
      expect(json).not_to be_empty
      expect(json.size).to eq(10)
    end
    it 'returns status code 200' do
      expect(response).to have_http_status(200)
    end
  end

  # Test suite for GET /rentals/:id
  describe 'GET /rentals/:id' do
    before { get "/rentals/#{rental_id}" }

    context 'when the record exists' do
      it 'returns the rental' do
        expect(json).not_to be_empty
        expect(json['id']).to eq(rental_id)
      end

      it 'returns status code 200' do
        expect(response).to have_http_status(200)
      end
    end

    context 'when the record does not exist' do
      let(:rental_id) { 100 }

      it 'returns status code 404' do
        expect(response).to have_http_status(404)
      end

      it 'returns a not found message' do
        expect(response.body).to match(/Couldn't find Rental/)
      end
    end
  end

#   # Test suite for POST /rentals
#   describe 'POST /rentals' do
#     # valid payload
#     let(:valid_attributes) { { rental_id: '1234', apparel_id: '1324', checkout_date: '', expected_return_date: '', student_id: '23243' } }

#     context 'when the request is valid' do
#       before { post '/rentals', params: valid_attributes }

#       it 'creates a rental' do
#         expect(json['title']).to eq('Learn Elm')
#       end

#       it 'returns status code 201' do
#         expect(response).to have_http_status(201)
#       end
#     end

#     context 'when the request is invalid' do
#       before { post '/rentals', params: { rental_id: '1234', apparel_id: '1324', student_id: '23243' } }

#       it 'returns status code 422' do
#         expect(response).to have_http_status(422)
#       end

#       it 'returns a validation failure message' do
#         expect(response.body)
#           .to match(/Validation failed: Dates can't be blank/)
#       end
#     end
#   end

#   # Test suite for PUT /rentals/:id
#   describe 'PUT /rentals/:id' do
#     let(:valid_attributes) { { title: 'Shopping' } }

#     context 'when the record exists' do
#       before { put "/rentals/#{rental_id}", params: valid_attributes }

#       it 'updates the record' do
#         expect(response.body).to be_empty
#       end

#       it 'returns status code 204' do
#         expect(response).to have_http_status(204)
#       end
#     end
#   end

#   # Test suite for DELETE /rentals/:id
#   describe 'DELETE /rentals/:id' do
#     before { delete "/rentals/#{rental_id}" }

#     it 'returns status code 204' do
#       expect(response).to have_http_status(204)
#     end
#   end
end