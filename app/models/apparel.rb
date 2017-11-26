class Apparel < ApplicationRecord
  has_many :rentals, dependent: :destroy

  validates :apparel_id, presence: true, uniqueness: true

  def self.by_apparel_id(apparelId)
    apparel = Apparel.where(apparel_id: apparelId).first
    if apparel == nil
      raise RecordNotFoundError.new(Response_Message::APPAREL_ENTRY_NOT_FOUND)
    end

    return apparel
  end

  def self.view_stock(size = nil, stock = 1)
    checkedoutApparel = Rental.select("apparel_id").where("actual_return_date is NULL")
    if size == nil
      if stock == 1
        checked_out = Apparel.select("apparel_id,sex,article,size").where("id in (?)",checkedoutApparel)
      else
        checked_out = Apparel.select("apparel_id,sex,article,size").where("id not in (?)",checkedoutApparel)
      end
    else
      if stock == 1
        checked_out = Apparel.select("apparel_id,sex,article,size").where("id in (?) and apparels.size in (?)",checkedoutApparel,size)
      else
        checked_out = Apparel.select("apparel_id,sex,article,size").where("id not in (?) and apparels.size in (?)",checkedoutApparel,size)
      end
    end

    return checked_out
  end

end
