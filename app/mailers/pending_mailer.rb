class PendingMailer < ApplicationMailer


  def send_pending(uin, name, email, checkout_date, expected_return_date)
    static_text = Constant.findValue("pendingMailText")
    sender_name = Constant.findValue("pendingMailSenderName")
    text = "Hi " + name + "," + "\n\n"
    text += "UIN :" + uin.to_s + "\n"
    text += "Checkout Date of Suit: " + Time.parse(checkout_date.to_s).strftime("%m/%d/%Y")+"\n"
    text += "Expected Return Date Of Suit: " + Time.parse(expected_return_date.to_s).strftime("%m/%d/%Y")+"\n"
    text += static_text
    text += "\n" + "Regards,"
    text += "\n" + sender_name

    mail(to: email, subject: "Pending Return Of Suit", body: text)
  end

  def send_overdue(uin, name, email, checkout_date, expected_return_date)
    static_text = Constant.findValue("overDueMailText")
    sender_name = Constant.findValue("overDueMailSenderName")
    text = "Hi " + name +","+"\n"
    text += "UIN :" + student_uin.to_s + "\n"
    text += "Checkout Date of Suit: " + Time.parse(checkout_date.to_s).strftime("%m/%d/%Y")+"\n"
    text += "Expected Return Date Of Suit: " + Time.parse(expected_return_date.to_s).strftime("%m/%d/%Y")+"\n"
    text += static_text
    text += "\n" + "Regards,"
    text += "\n" + sender_name
    mail(to: email, subject: "Suit OverDue", body: text)
  end
end
