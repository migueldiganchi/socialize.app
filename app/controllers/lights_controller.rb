class LightsController < ApplicationController


  def index 

    from = params[:from] ? params[:from] : 0
    limit = params[:limit] ? params[:from] : 3 # @todo: read from configuration (:per_page)

    @lights = Light.get_lights from, limit

    if request.xhr?
      render partial: 'app/lights'
    else
      redirect_to root_url
    end
  end

  def edit  

    # check for logged in user

    light = Light.find params[:id]

      # abort light.inspect
    
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
      render partial: 'app/light', locals: { light: light }
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

    abort 'here!'


  end

  private 

    def save_light light

      is_new = light.id.nil? || light.id == 0
      saved = is_new ? light.save : light.update_attributes(light_params)

      if saved

        if request.xhr?
          # render form into a var
          light_view = render_to_string partial: 'app/light', locals: { 
            light: light 
          }
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