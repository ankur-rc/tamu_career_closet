# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
Student.create(uin: 12, first_name: "DBDn", email: "lkab", phone: "81264")
Student.create(uin: 13, first_name: "skfj", email: "lkab", phone: "81264")
Student.create(uin: 14, first_name: "ejkfb", email: "lkab", phone: "81264")
Student.create(uin: 15, first_name: "efkb", email: "lkab", phone: "81264")
Student.create(uin: 16, first_name: "lfb", email: "lkab", phone: "81264")
Student.create(uin: 17, first_name: "flkb", email: "lkab", phone: "81264")
Student.create(uin: 18, first_name: "wlqfk", email: "lkab", phone: "81264")
Student.create(uin: 19, first_name: "flb", email: "lkab", phone: "81264")
Apparel.create(apparel_id: "01A", sex: "M", article: "Pants", size: "S")
Apparel.create(apparel_id: "02A", sex: "F", article: "Skirt", size: "L")
Apparel.create(apparel_id: "03A", sex: "M", article: "Pants", size: "M")
Apparel.create(apparel_id: "04A", sex: "F", article: "Skirt", size: "S")
Apparel.create(apparel_id: "05A", sex: "F", article: "Suit", size: "XS")
Apparel.create(apparel_id: "06A", sex: "M", article: "Pants", size: "S")
Apparel.create(apparel_id: "07A", sex: "M", article: "Pants", size: "XL")
Apparel.create(apparel_id: "08A", sex: "F", article: "Suit", size: "L")
Apparel.create(apparel_id: "09A", sex: "M", article: "Pants", size: "S")
Apparel.create(apparel_id: "21A", sex: "F", article: "Skirt", size: "L")
Rental.create(apparel_id: 1, checkout_date: '2017-10-10', expected_return_date: '2017-10-17', student_id:1)
Rental.create(apparel_id: 4, checkout_date: '2017-10-10', expected_return_date: '2017-10-17', actual_return_date: '2017-10-18', student_id:3)
Rental.create(apparel_id: 2, checkout_date: '2017-10-10', expected_return_date: '2017-10-17', student_id:9)
Rental.create(apparel_id: 6, checkout_date: '2017-10-10', expected_return_date: '2017-10-17', actual_return_date: '2017-10-19', student_id:7)
Rental.create(apparel_id: 3, checkout_date: '2017-10-10', expected_return_date: '2017-10-17', student_id:4)
Rental.create(apparel_id: 5, checkout_date: '2017-10-10', expected_return_date: '2017-10-17', student_id:6)
Constant.create(key:"noOfCheckoutDays", value:"7")
Constant.create(key:"pendingMailText", value:" This is a reminder to send your suits back to career closet after drycleaning it")
Constant.create(key:"overDueMailText", value:"This is a reminder to send back your suits to career closet else an registration hold will be put on the record")
Constant.create(key:"pendingMailSenderName", value:"Sonali")
Constant.create(key:"overDueMailSenderName", value:"Sonali")


