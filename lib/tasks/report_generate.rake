namespace :report_generate do
  desc "Periodically generate reports"
  task generate: :environment do
    V1::RentalsController.create_report
  end

end
