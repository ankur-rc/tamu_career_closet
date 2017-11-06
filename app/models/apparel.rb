class Apparel < ApplicationRecord

  has_many :rentals, dependent: :destroy

  validates :apparel_id, presence: true, uniqueness: true


  def self.findApparelByApparelId(apparelId)
    begin
    @apparel=Apparel.where(:apparel_id =>apparelId ).first
     if @apparel==nil
      raise RecordNotFoundError.new(Response_Message::APPAREL_ENTRY_NOT_FOUND)
     end
    end
    return @apparel
  end

  def self.view_stock(size=nil,stock=1)
  #stock=1 => search for checkedout apparel(default), else if stock=0 => search for available apparels
  @Temporary = Apparel.left_outer_joins(:rentals).select("
	    apparels.apparel_id as apparelId, apparels.article as article, apparels.sex as sex, apparels.size as size")
	if size == nil
	  if stock == 1
	    @checkedOut = @Temporary.where("rentals.actual_return_date is NULL AND rentals.checkout_date is NOT NULL")
	  else
	    @checkedOut = @Temporary.where("rentals.actual_return_date is NOT NULL OR rentals.checkout_date is NULL")
	  end
	  
	else
	  if stock == 1
	    @checkedOut = @Temporary.where("apparels.size in (?) AND rentals.actual_return_date is NULL AND rentals.checkout_date is NOT NULL", size)
	  else
	    @checkedOut = @Temporary.where("apparels.size in (?) AND (rentals.actual_return_date is NOT NULL OR rentals.checkout_date is NULL)", size)
	  end
	end
    return @checkedOut
  end

end
