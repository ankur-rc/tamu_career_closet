module V1
  class ApparelsController < ApplicationController
    skip_before_action :authorize_request
    before_action :set_apparel, only: [:show, :edit, :update, :destroy]

    # GET /apparels
    # GET /apparels.json
    def index
      # if params[:size] != nil
      #   apparels = Apparel.where("size in (?)", params[:size])
      # else
      #   apparels = Apparel.all
      # end
      @apparels = Apparel.all
    # render json:apparels
      json_response({success: true, data: @apparels},:ok)
    end

    def bysize
      if params[:size] != nil
        @apparels = Apparel.where("size in (?)", params[:size])
      end
      # render json:apparels
      if  !(@apparels.empty?())
        json_response({success: true, data: @apparels},:ok)
      else
        json_response({success: true, message: Message.not_found()},:unprocessable_entity)   
      end  
    end
	
	def bysize_and_stock
	  if params[:size] != nil and params[:stock] != nil
	    @apparel = Apparel.view_stock(params[:size],params[:checkedout].to_i)
	  end
      if  !(@apparels.empty?())
        json_response({success: true, data: @apparels},:ok)
      else
        json_response({success: true, message: Message.not_found()},:unprocessable_entity)   
      end  
	end
	
    # GET /apparels/1
    # GET /apparels/1.json
    def show
      # @apparel = Apparel.where(apparel_id: params[:id])
	  if @apparel.empty?()
        # msg = { :status => :unprocessable_entity, :message => "Record doesn't exist"}
        # render :json => msg
        json_response({success: false, message: Message.not_found('Apparel record')},:unprocessable_entity)
	  else
        json_response({success: true, data: @apparel[0]},:ok)
	  end
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
      Apparel.create!(apparel_params)
      json_response({success: true, message: Message.created_successfuly('Apparel record')},:created)
      # @apparel = Apparel.new(apparel_params)
      

      # respond_to do |format|
      #   if @apparel.save
      #     format.html { redirect_to @apparel, notice: 'Apparel was successfully created.' }
      #     format.json { render :show, status: :created, location: @apparel }
      #   else
      #     format.html { render :new }
      #     format.json { render json: @apparel.errors, status: :unprocessable_entity }
      #   end
      # end
    end

    # PATCH/PUT /apparels/1
    # PATCH/PUT /apparels/1.json
    def update
	  if @apparel.empty?()
        # msg = { :status => :unprocessable_entity, :message => "Record doesn't exist"}
        # render :json => msg
        json_response({success: false, message: Message.not_found('Apparel record')},:unprocessable_entity)
	  else
        Apparel.update(apparel_params)
        json_response({success: true, message: Message.updated_successfuly('Apparel record')},:ok)
      # respond_to do |format|
      #   if @apparel.update(apparel_params)
      #     format.html { redirect_to @apparel, notice: 'Apparel was successfully updated.' }
      #     format.json { render :show, status: :ok, location: @apparel }
      #   else
      #     format.html { render :edit }
      #     format.json { render json: @apparel.errors, status: :unprocessable_entity }
      #   end
      end
    end

    # DELETE /apparels/1
    # DELETE /apparels/1.json
    def destroy
	  if @apparel.empty?()
        # msg = { :status => :unprocessable_entity, :message => "Record doesn't exist"}
        # render :json => msg
        json_response({success: false, message: Message.not_found('Apparel record')},:unprocessable_entity)
	  else
        if Apparel.destroy(@apparel.first.id)
            # msg = { :status => :deleted, :message => "Student was successfully deleted."}
            # render :json => msg
            json_response({success: true, message: Message.destroyed_successfuly('Apparel record')},:ok) 
        else
            # msg = { :status => :unprocessable_entity, :message => @student.errors}
            # render :json => msg
            json_response({success: true, message: @apparel.errors},:ok)
        end
      end
    end

    def get_sizes  
      all_sizes = Apparel.distinct.pluck('size')
      json_obj=Hash.new()
      json_obj['sizes']=all_sizes
      # render json:json_obj
      json_response({success: true, data: json_obj},:ok)
    end
    
	def get_stock
      @apparels = Apparel.view_stock(nil,params[:stock])
	  if  !(@apparels.empty?())
        json_response({success: true, data: @apparels},:ok)
      else
        json_response({success: true, message: Message.not_found()},:unprocessable_entity)   
      end 
    end
  
    private
      # Use callbacks to share common setup or constraints between actions.
      def set_apparel
        @apparel = Apparel.where(:apparel_id => params[:id])
      end

      # Never trust parameters from the scary internet, only allow the white list through.
      def apparel_params
        params.require(:apparel).permit(:apparel_id, :sex, :article, :size, :notes)
      end

  end
end