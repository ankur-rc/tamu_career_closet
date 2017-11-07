FactoryGirl.define do
  factory :apparel do
    apparel_id "1A"
    sex "M"
    article "Suit"
    size "L"
    notes "Dummy notes"
  end

  factory :apparel2, parent: :apparel do
    apparel_id "2A"
    sex "F"
    article "Skirt"
    size "M"
    notes "Dummy notes"
  end

  factory :update_apparel, parent: :apparel do
    apparel_id "1A"
    sex "F"
    article "Skirt"
    size "M"
    notes "Dummy notes new"
  end
end
