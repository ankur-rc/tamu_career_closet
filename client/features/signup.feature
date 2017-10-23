#features/signup.feature
Feature: Signup 
    As a user of Career Closet
    I should be able to Signup/Register
    In order to use the Portal Dashboard

    Scenario: Valid Details in the  Register Form
        Given I am on the Registration Page
        And I am not already Logged in
        And I do not have an account already 
        When I enter valid "First Name"
        And I enter valid "Last Name" 
        And I choose a valid "Role" 
        And I enter valid "Username" 
        And I enter valid "Primary Email" 
        And I enter valid "Phone Number" 
        And I enter valid "Password" 
        And I enter correct "Confirm Password" 
        And I click the Submit button
        Then I should have an account created at the Career Closet Portal

    Scenario: Invalid Details in the Login Form
        Given I am on the Registration Page
        And I am not already Logged in
        And I do not have an account already 
        When I enter invalid details 
        And I click the Submit button
        Then I should receive a message that my "details are invalid"
        And I should stay on the Registration Page
