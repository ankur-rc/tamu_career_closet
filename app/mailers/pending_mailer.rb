class PendingMailer < ApplicationMailer


  def sendPendingMail(student_uin,student_name,student_email,checkout_date,expected_return_date)
    staticTextForPendingMail=Constant.findValue("pendingMailText")
    text=" Hi" +student_name+","+"\n"
    text+=" UIN :"+student_uin.to_s+"\n"
    text+=" Checkout Date of Suit: "+checkout_date.to_s+"\n"
    text+=" Expected Return Date Of Suit: "+ expected_return_date.to_s+"\n"
    text+=staticTextForPendingMail


    mail(to:student_email, subject:"Pending Return Of Suit", body:text)
  end
end
