require 'test_helper'

class RentalsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @rental = rentals(:one)
  end

  test "should get index" do
    get rentals_url
    assert_response :success
  end

  test "should get new" do
    get new_rental_url
    assert_response :success
  end

  test "should create rental" do
    assert_difference('Rental.count') do
      post rentals_url, params: { rental: { actual_return_date: @rental.actual_return_date, apparel_id: @rental.apparel_id, checkout_date: @rental.checkout_date, expected_return_date: @rental.expected_return_date, rental_id: @rental.rental_id, student_id: @rental.student_id, uin: @rental.uin } }
    end

    assert_redirected_to rental_url(Rental.last)
  end

  test "should show rental" do
    get rental_url(@rental)
    assert_response :success
  end

  test "should get edit" do
    get edit_rental_url(@rental)
    assert_response :success
  end

  test "should update rental" do
    patch rental_url(@rental), params: { rental: { actual_return_date: @rental.actual_return_date, apparel_id: @rental.apparel_id, checkout_date: @rental.checkout_date, expected_return_date: @rental.expected_return_date, rental_id: @rental.rental_id, student_id: @rental.student_id, uin: @rental.uin } }
    assert_redirected_to rental_url(@rental)
  end

  test "should destroy rental" do
    assert_difference('Rental.count', -1) do
      delete rental_url(@rental)
    end

    assert_redirected_to rentals_url
  end
end
