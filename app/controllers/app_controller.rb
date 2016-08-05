class AppController < ApplicationController
  include ActionView::Helpers::AssetUrlHelper
  include ApplicationHelper

  def index 
    @username = logged_in? ? " #{current_user.name}" : ''

    if logged_in?
      @invitation_text_button = 'Invita a tus amigos a encender una luz'
    end

    @title = 'My Candel'
    
    @lights = Light.get_lights 0, 5 # last lights to show

  end

end