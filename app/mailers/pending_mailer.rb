require 'sendgrid-ruby'
include SendGrid
require 'json'

class PendingMailer
  def self.mailer_pending_emails(uin, name, email, checkout_date, expected_return_date)
    email_from = Email.new(name: 'TAMU Career Closet', email: 'no-reply@tamucareercloset.com')
    email_subject = "[Reminder] Upcoming rental return"
    email_to = Email.new(name: name, email: email)

    email_body = "Hi " + name + ","
    email_body += "<p style=\"font-size:22px\">" + Constant.find_value("pendingMailText").to_s + "</p>"
    email_body += "Details of your rental are as follows:"
    email_body += "<br>" + "UIN: " + "<strong>" + "*****" + uin.to_s[uin.to_s.size - 4..-1] + "</strong>"
    email_body += "<br>" + "Checkout date: " + "<strong>" + Time.parse(checkout_date.to_s).strftime("%m/%d/%Y") + "</strong>"
    email_body += "<br>" + "Expected return date: " + "<strong>" + Time.parse(expected_return_date.to_s).strftime("%m/%d/%Y") + "</strong>"
    email_body += "<br><br>" + "<small>" + "Note: This is an auto-generated email. Do not respond to this email. \
                                            Contact Career Closet at http://www.tamucareercloset.com/contact" + "</small>"
    email_body += "<br><br>" + "Regards,"
    email_body += "<br>" + Constant.find_value("pendingMailSenderName") + "."

    email_content = Content.new(type: 'text/html', value: email_body)
    email_object = SendGrid::Mail.new(email_from, email_subject, email_to, email_content)

    sg = SendGrid::API.new(api_key: ENV['SENDGRID_API_KEY'])
    email_response = sg.client.mail._('send').post(request_body: email_object.to_json)
    puts email_response.status_code
    puts email_response.body
    puts email_response.headers
  end

  def self.mailer_overdue_emails(uin, name, email, checkout_date, expected_return_date)
    email_from = Email.new(name: 'TAMU Career Closet', email: 'no-reply@tamucareercloset.com')
    email_subject = "[Alert] Rental overdue"
    email_to = Email.new(name: name, email: email)

    email_body = "Hi " + name + ","
    email_body += "<p style=\"font-size:22px\">" + Constant.find_value("overDueMailText").to_s + "</p>"
    email_body += "Details of your rental are as follows:"
    email_body += "<br>" + "UIN: " + "<strong>" + "*****" + uin.to_s[uin.to_s.size - 4..-1] + "</strong>"
    email_body += "<br>" + "Checkout date: " + "<strong>" + Time.parse(checkout_date.to_s).strftime("%m/%d/%Y") + "</strong>"
    email_body += "<br>" + "Expected return date: " + "<strong>" + Time.parse(expected_return_date.to_s).strftime("%m/%d/%Y") + "</strong>"
    email_body += "<br><br>" + "<small>" + "Note: This is an auto-generated email. Do not respond to this email. \
                                            Contact Career Closet at http://www.tamucareercloset.com/contact" + "</small>"
    email_body += "<br><br>" + "Regards,"
    email_body += "<br>" + Constant.find_value("overDueMailSenderName") + "."

    email_content = Content.new(type: 'text/html', value: email_body)
    email_object = SendGrid::Mail.new(email_from, email_subject, email_to, email_content)

    sg = SendGrid::API.new(api_key: ENV['SENDGRID_API_KEY'])
    email_response = sg.client.mail._('send').post(request_body: email_object.to_json)
    puts email_response.status_code
    puts email_response.body
    puts email_response.headers
  end
end
