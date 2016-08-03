class SessionsController < ApplicationController

  def create
    user = User.from_omniauth(env['omniauth.auth']);
    light = user.lights.build
    session[:user_id] = user.id

    @invitation_text_button = 'Invita una seca a tus amigos'
    @app_panel = render_to_string partial: 'app/light', locals: { light: light }
    
    if request.xhr?
      render json: { 
        user: {
          uid: user.uid,
          name: user.name
        }, 
        app_panel: @app_panel }
    else
      redirect_to root_url
    end
  end

  def destroy
    session[:user_id] = nil
    redirect_to root_url
  end

end