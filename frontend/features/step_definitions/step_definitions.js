var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
var expect = chai.expect;
module.exports = function() {

      //LOGIN VALID CREDENTIALS
      this.Given(/^I am on the Login Page$/, function(site) {
        // browser.get(site);
      });
    
      this.When(/^I enter valid username$/, function(task) {
        // element(by.model('todoList.todoText')).sendKeys(task);
      });
    
      this.When(/^I enter associated password$/, function(task) {
        // element(by.model('todoList.todoText')).sendKeys(task);

      });

      this.When(/^I click the Login button$/, function() {
        // var el = element(by.css('[value="add"]'));
        // el.click();
      });
    
      this.Then(/^I should be able to enter the Portal Dashboard$/, function(callback) {
        // var todoList = element.all(by.repeater('todo in todoList.todos'));
        // expect(todoList.count()).to.eventually.equal(3);
        // expect(todoList.get(2).getText()).to.eventually.equal('Do not Be Awesome')
        //   .and.notify(callback);
      });

      //LOGIN INVALID CREDENTIALS
    
      this.When(/^I enter invalid credentials$/, function(task) {
        // element(by.model('todoList.todoText')).sendKeys(task);
          // element(by.model('todoList.todoText')).sendKeys(task);
      });
    
      this.Then(/^I should receive a message that my "([^"]*)"$/, function(callback) {
        // var todoList = element.all(by.repeater('todo in todoList.todos'));
        // expect(todoList.count()).to.eventually.equal(3);
        // expect(todoList.get(2).getText()).to.eventually.equal('Do not Be Awesome')
        //   .and.notify(callback);
      });
      this.Then(/^I should receive a message that my "([^"]*)"$/, function(callback) {
        // var todoList = element.all(by.repeater('todo in todoList.todos'));
        // expect(todoList.count()).to.eventually.equal(3);
        // expect(todoList.get(2).getText()).to.eventually.equal('Do not Be Awesome')
        //   .and.notify(callback);
      });

      //SIGNUP VALID DETAILS
      this.Given(/^I am on the Registration Page$/, function(site) {
        // browser.get(site);
      });
      this.Given(/^I am not already Logged in$/, function(site) {
        // browser.get(site);
      });
      this.Given(/^I do not have an account already$/, function(site) {
        // browser.get(site);
      });
    
      this.When(/^I enter valid "([^"]*)"$/, function(task,arg) {
        // element(by.model('todoList.todoText')).sendKeys(task);
      });
      this.When(/^I choose a valid "([^"]*)"$/, function(task,arg) {
        // element(by.model('todoList.todoText')).sendKeys(task);
      });
      this.When(/^I enter correct "([^"]*)"$/, function(task,arg) {
        // element(by.model('todoList.todoText')).sendKeys(task);
      });

      this.When(/^I click the Submit button$/, function() {
        // var el = element(by.css('[value="add"]'));
        // el.click();
      });
    
      this.Then(/^I should have an account created at the Career Closet Portal$/, function(callback) {
        // var todoList = element.all(by.repeater('todo in todoList.todos'));
        // expect(todoList.count()).to.eventually.equal(3);
        // expect(todoList.get(2).getText()).to.eventually.equal('Do not Be Awesome')
        //   .and.notify(callback);
      });
      //SIGNUP INVALID DETAILS
      
      this.When(/^I enter invalid details$/, function(task) {
        // element(by.model('todoList.todoText')).sendKeys(task);
      });

      this.Then(/^I should receive a message that my "([^"]*)"$/, function(callback,arg) {
        // var todoList = element.all(by.repeater('todo in todoList.todos'));
        // expect(todoList.count()).to.eventually.equal(3);
        // expect(todoList.get(2).getText()).to.eventually.equal('Do not Be Awesome')
        //   .and.notify(callback);
      });

      this.Then(/^I should stay on the Registration Page$/, function(callback,arg) {
        // var todoList = element.all(by.repeater('todo in todoList.todos'));
        // expect(todoList.count()).to.eventually.equal(3);
        // expect(todoList.get(2).getText()).to.eventually.equal('Do not Be Awesome')
        //   .and.notify(callback);
      });



    }