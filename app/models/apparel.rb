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
    apparel_join_rental = Apparel.left_outer_joins(:rentals).select("
        apparels.apparel_id as apparelId, apparels.article as article,
        apparels.sex as sex, apparels.size as size")
    if size == nil
      if stock == 1
        checked_out = apparel_join_rental.where("rentals.actual_return_date is NULL AND
            rentals.checkout_date is NOT NULL")
      else
        checked_out = apparel_join_rental.where("rentals.actual_return_date is NOT NULL OR
            rentals.checkout_date is NULL")
      end
    else
      if stock == 1
        checked_out = apparel_join_rental.where("apparels.size in (?) AND
            rentals.actual_return_date is NULL AND rentals.checkout_date is NOT NULL", size)
      else
        checked_out = apparel_join_rental.where("apparels.size in (?) AND
            (rentals.actual_return_date is NOT NULL OR rentals.checkout_date is NULL)", size)
      end
    end

    return checked_out
  end

end
