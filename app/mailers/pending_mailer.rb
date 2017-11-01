class PendingMailer < ApplicationMailer


  def sendPendingMail(student,rental)
    @student=student
    @rental=rental
    text="You have taken suits from tamu closet"+@student.first_name
    mail(to:@student.email, subject:"Pending Returns", body:text)
  end
end
