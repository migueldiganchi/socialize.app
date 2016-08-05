class LightsController < ApplicationController


  def index 

    from = params[:from] ? params[:from] : 0
    limit = params[:limit] ? params[:from] : 3 # @todo: read from configuration

    @lights = Light.get_lights from, limit

    if request.xhr?
      render partial: 'app/lights'
    else
      redirect_to root_url
    end
  end

  def show  

    # @todo: preconditions

    light = Light.find params[:id]

    if request.xhr?
      render partial: 'app/light', locals: {light: light}
    else
      redirect_to root_url
    end

  end

  def new
    if request.xhr?
      render 'light', locals: { light: Light.new }
    else
      redirect_to root_url
    end
  end

  def create

    light = current_user.lights.build(light_params)

    if light.save

      if request.xhr?

        # render form into a var
        light_view = render_to_string partial: 'app/light', locals: { 
          light: light 
        }

        render json: {
          light: light.to_json, 
          light_view: light_view
        }
        
      end

    else
      # @todo: handle error
    end
  end

  def update
  end

  def destroy
  end

  private 

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