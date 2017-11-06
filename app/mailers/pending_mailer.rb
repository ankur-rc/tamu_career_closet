class PendingMailer < ApplicationMailer


  def sendPendingMail(student_uin,student_name,student_email,checkout_date,expected_return_date)
    staticTextForPendingMail=Constant.findValue("pendingMailText")
    pendingMailSenderName=Constant.findValue("pendingMailSenderName")
    text="Hi " +student_name+","+"\n\n"
    text+="UIN :"+student_uin.to_s+"\n"
    text+="Checkout Date of Suit: "+Time.parse(checkout_date.to_s).strftime("%m/%d/%Y")+"\n"
    text+="Expected Return Date Of Suit: "+ Time.parse(expected_return_date.to_s).strftime("%m/%d/%Y")+"\n"
    text+=staticTextForPendingMail
    text+="\n"+"Regards,"
    text+="\n"+pendingMailSenderName

    mail(to:student_email, subject:"Pending Return Of Suit", body:text)
  end

  def sendOverDueEmails(student_uin,student_name,student_email,checkout_date,expected_return_date)
    staticTextForOverDueMail=Constant.findValue("overDueMailText")
    overDueMailSenderName=Constant.findValue("overDueMailSenderName")
    text="Hi " +student_name+","+"\n"
    text+="UIN :"+student_uin.to_s+"\n"
    text+="Checkout Date of Suit: "+Time.parse(checkout_date.to_s).strftime("%m/%d/%Y")+"\n"
    text+="Expected Return Date Of Suit: "+Time.parse( expected_return_date.to_s).strftime("%m/%d/%Y")+"\n"
    text+=staticTextForOverDueMail
    text+="\n"+"Regards,"
    text+="\n"+overDueMailSenderName
    mail(to:student_email, subject:"Suit OverDue", body:text)
  end
end
