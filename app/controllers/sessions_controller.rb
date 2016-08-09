class SessionsController < ApplicationController

  def create
    user = User.from_omniauth(env['omniauth.auth']);
    light = user.lights.build
    session[:user_id] = user.id

    @invitation_text_button = 'Invita una seca a tus amigos'
    # @app_panel = render_to_string partial: 'app/light', locals: { light: light }  

    @from = 0
    @limit = 5 # @todo: read from configuration (:per_page)
    @total_lights = Light.get_lights.count
    @paginated_lights = Light.get_paginated_lights @from, @limit
    @show_next_button = (@from + @limit) < @total_lights
    @app_panel = render_to_string partial: 'app/app_panel'

    # abort @testing.inspect


    # @todo: get panel with lights
    
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