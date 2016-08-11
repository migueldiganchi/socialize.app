class SessionsController < ApplicationController

  def create
    user = User.from_omniauth(env['omniauth.auth']);
    light = user.lights.build
    session[:user_id] = user.id

    @invitation_text_button = 'Invita a tus amigos a dar ideas para cambiar el mundo'
    @from = 0
    @limit = 8 # @todo: read from configuration (:per_page)
    @total_lights = Light.get_lights.count
    @paginated_lights = Light.get_paginated_lights @from, @limit
    @ranked_lights = Light.get_paginated_lights 0, 2
    @show_next_button = (@from + @limit) < @total_lights
    @app_panel = render_to_string partial: 'app/app_panel'
    
    if request.xhr?
      render json: { 
        user: { uid: user.uid, name: user.name }, 
        app_panel: @app_panel 
      }
    else
      redirect_to root_url
    end
  end

  def destroy
    session[:user_id] = nil
    redirect_to root_url
  end

end