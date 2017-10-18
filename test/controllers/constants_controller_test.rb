require 'test_helper'

class ConstantsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @constant = constants(:one)
  end

  test "should get index" do
    get constants_url
    assert_response :success
  end

  test "should get new" do
    get new_constant_url
    assert_response :success
  end

  test "should create constant" do
    assert_difference('Constant.count') do
      post constants_url, params: { constant: { created: @constant.created, key: @constant.key, updated: @constant.updated, value: @constant.value } }
    end

    assert_redirected_to constant_url(Constant.last)
  end

  test "should show constant" do
    get constant_url(@constant)
    assert_response :success
  end

  test "should get edit" do
    get edit_constant_url(@constant)
    assert_response :success
  end

  test "should update constant" do
    patch constant_url(@constant), params: { constant: { created: @constant.created, key: @constant.key, updated: @constant.updated, value: @constant.value } }
    assert_redirected_to constant_url(@constant)
  end

  test "should destroy constant" do
    assert_difference('Constant.count', -1) do
      delete constant_url(@constant)
    end

    assert_redirected_to constants_url
  end
end
