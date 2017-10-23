class ApparelsController < ApplicationController
  before_action :set_apparel, only: [:show, :edit, :update, :destroy]

  # GET /apparels
  # GET /apparels.json
  def index
    if params[:size] != nil
      apparels = Apparel.where("size in (?)", params[:size])
    else
      apparels = Apparel.all
    end
	render json:apparels
  end

  # GET /apparels/1
  # GET /apparels/1.json
  def show
  end

  # GET /apparels/new
  def new
    @apparel = Apparel.new
  end

  # GET /apparels/1/edit
  def edit
  end

  # POST /apparels
  # POST /apparels.json
  def create
    @apparel = Apparel.new(apparel_params)

    respond_to do |format|
      if @apparel.save
        format.html { redirect_to @apparel, notice: 'Apparel was successfully created.' }
        format.json { render :show, status: :created, location: @apparel }
      else
        format.html { render :new }
        format.json { render json: @apparel.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /apparels/1
  # PATCH/PUT /apparels/1.json
  def update
    respond_to do |format|
      if @apparel.update(apparel_params)
        format.html { redirect_to @apparel, notice: 'Apparel was successfully updated.' }
        format.json { render :show, status: :ok, location: @apparel }
      else
        format.html { render :edit }
        format.json { render json: @apparel.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /apparels/1
  # DELETE /apparels/1.json
  def destroy
    @apparel.destroy
    respond_to do |format|
      format.html { redirect_to apparels_url, notice: 'Apparel was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def get_sizes  
    all_sizes = Apparel.distinct.pluck('size')
	json_obj=Hash.new()
	json_obj['sizes']=all_sizes
	render json:json_obj
  end
  
  private
    # Use callbacks to share common setup or constraints between actions.
    def set_apparel
      @apparel = Apparel.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def apparel_params
      params.require(:apparel).permit(:apparel_id, :sex, :article, :size, :notes)
    end
end
