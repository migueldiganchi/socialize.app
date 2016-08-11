class LightsController < ApplicationController
  # @todo: check for sessions & ajax requests

  def index 

    if request.xhr?
      # @todo: searching  
      @from = (params[:from]  && !params[:from].empty?) ? params[:from].to_i : 0
      @limit = (params[:limit] && !params[:limit].empty?) ? params[:limit].to_i : 2 

      # @todo: read @limit from configuration (:per_page)
      @total_lights = Light.get_lights.count
      @paginated_lights = Light.get_paginated_lights @from, @limit
      # @todo: get ranked lights
      @ranked_lights = Light.get_paginated_lights 0, 2 
      @show_next_button = (@from + @limit) < @total_lights
      # abort @show_next_button.inspect
      render partial: 'app/lights', locals: {
        show_next_button: @show_next_button, 
        paginated_lights: @paginated_lights
      }
      
    else
      redirect_to root_url
    end
  end

  def edit  
    # @todo: preconditions > check for params
    light = Light.find params[:id]
    if request.xhr?
      render partial: 'app/light', locals: { 
        light: light,
        changing: logged_in? && current_user.id == light.user.id
      }
    else
      redirect_to root_url
    end
  end

  def show  
    # @todo: preconditions > check for params
    light = Light.find params[:id]
    if request.xhr?
      wrap_light = params.has_key?(:wrap) ? params[:wrap] == 'true' : true
      if wrap_light
        render partial: 'app/wrapped_light', locals: { light: light }
      else
        render partial: 'app/light', locals: { light: light }
      end
    else
      redirect_to root_url
    end
  end

  def new
    if request.xhr?
      render 'light', locals: { light: current_user.lights.build }
    else
      redirect_to root_url
    end
  end

  def create
    # create a new light to the current user
    light = current_user.lights.build light_params
    # respond to the user saveing the light
    save_light light
  end

  def update
    # @todo: preconditions > check for params
    # get existing light
    light = Light.find params[:id]
    # respond with save_light
    save_light light
  end

  def destroy
    # @todo: check for preconditions params
    light = Light.find params[:id]
    if light.update_attribute(:deleted_at, DateTime.now)
       if request.xhr?
        render json: { 
          status: true, 
          message: 'La luz se ha eliminado exitosamente' 
        }
      else
        redirect_to root_url
      end 
    else
      # @todo: handle errors
    end

  end

  def ranking

    # @todo: list of ranking items;
    @ranked_lights = Light.get_paginated_lights 0, 2

    if request.xhr?
      render partial: 'app/lights', locals: { 
        show_next_button: false,
        paginated_lights: @ranked_lights, 
        col_reference: 12, 
        ranked: true
      }
    else
      redirect_to root_url
    end
  end

  private 

    def save_light light

      is_new = light.id.nil? || light.id == 0
      saved = is_new ? light.save : light.update_attributes(light_params)

      if saved
        if request.xhr?
          if is_new
            light_view = render_to_string(
              partial: 'app/wrapped_light', 
              locals: { light: light }
            )
          else
            light_view = render_to_string(
              partial: 'app/light', 
              locals: { light: light }
            )
          end

          # respond the user
          render json: {
            is_new: is_new,
            light: light.to_json, 
            light_view: light_view
          }
        else
          redirect_to root_url
        end

      else
        # @todo: handle error
      end
    end

    def light_params
      params.require(:light).permit(:id, :description);
    end

    # def respond_with(light)
    #   respond_to do |format|
    #     format.json do
    #       render json: { id: light.id }    
    #     end
    #   end      
    # end


end