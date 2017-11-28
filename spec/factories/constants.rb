FactoryGirl.define do
  factory :constant do
    key "noOfCheckoutDays"
    value "7"  
  end
  
  factory :pending_email_text,  parent: :constant do
    key "pendingMailText"
    value "This is a reminder to send your suits back to career closet after drycleaning it"
  end

  factory :overdue_email_text,  parent: :constant do
    key "overDueMailText"
    value "This is a reminder to send back your suits to career closet else an registration hold will be put on the record"
  end
  
  factory :pending_email_sender,  parent: :constant do
    key "pendingMailSenderName"
    value "ABC"
  end
  
  factory :overdue_email_sender,  parent: :constant do
    key "overDueMailSenderName"
    value "XYZ"
  end
end
