#features/login.feature
Feature: Login 
    As a user of Career Closet
    I should be able to Login
    In order to enter the Portal Dashboard

    Scenario: Valid Credentials in the Login Form
        Given I am on the Login Page 
        When I enter valid username
        And I enter associated password 
        And I click the Login button
        Then I should be able to enter the Portal Dashboard

    Scenario: Invalid Credentials in the Login Form
        Given I am on the Login Page 
        When I enter invalid credentials
        And I click the Login button
        Then I should receive a message that my "credentials are invalid"
        And I should be redirected to the Login Page
       