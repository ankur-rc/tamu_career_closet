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


end
