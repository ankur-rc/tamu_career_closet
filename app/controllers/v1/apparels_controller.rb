module V1
  class ApparelsController < ApplicationController
    before_action :set_apparel, only: [:show, :edit, :update, :destroy]

    # GET /apparels
    # GET /apparels.json
    def index
      @apparels = Apparel.all
      json_response({success: true, data: @apparels}, :ok)
    end

    def bysize
      if params[:size] != nil
        @apparels = Apparel.where("size in (?)", params[:size])
      end

      if !(@apparels.empty?())
        json_response({success: true, data: @apparels}, :ok)
      else
        json_response({success: true, message: Message.not_found()}, :unprocessable_entity)
      end  
    end

    def bysize_and_stock
      if params[:size] != nil and params[:stock] != nil
        @apparels = Apparel.view_stock(params[:size],params[:stock].to_i)
      end
        if !(@apparels.empty?())
          json_response({success: true, data: @apparels}, :ok)
        else
          json_response({success: true, message: Message.not_found()}, :unprocessable_entity)
        end
    end

    # GET /apparels/1
    # GET /apparels/1.json
    def show
      if @apparel.empty?()
        json_response({success: false, message: Message.not_found('Apparel record')}, :unprocessable_entity)
      else
        json_response({success: true, data: @apparel[0]}, :ok)
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
      json_response({success: true, message: Message.created_successfuly('Apparel record')}, :created)
    end

    # PATCH/PUT /apparels/1
    # PATCH/PUT /apparels/1.json
    def update
      if @apparel.empty?()
        json_response({success: false, message: Message.not_found('Apparel record')}, :unprocessable_entity)
      else
        @apparel.update(apparel_params)
        json_response({success: true, message: Message.updated_successfuly('Apparel record')}, :ok)
      end
    end

    # DELETE /apparels/1
    # DELETE /apparels/1.json
    def destroy
      if @apparel.empty?()
        json_response({success: false, message: Message.not_found('Apparel record')}, :unprocessable_entity)
      else
        apparel_rental = Apparel.view_stock.where(apparel_id: params[:id])
        if !(apparel_rental.empty?())
          json_response({success: false, message: Message.existing_association('Apparel')}, :unprocessable_entity)
          return
        end

        if Apparel.destroy(@apparel.first.id)
          json_response({success: true, message: Message.destroyed_successfuly('Apparel record')}, :ok)
        else
          json_response({success: true, message: @apparel.errors}, :ok)
        end
      end
    end

    def get_sizes  
      all_sizes = Apparel.distinct.pluck('size')

      response = Hash.new()
      response['sizes'] = all_sizes
      json_response({success: true, data: response}, :ok)
    end
    
    def get_stock
      @apparels = Apparel.view_stock(nil, params[:stock].to_i)
        if !(@apparels.empty?())
          json_response({success: true, data: @apparels}, :ok)
        else
          json_response({success: true, message: Message.not_found()}, :unprocessable_entity)
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
