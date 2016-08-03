class AppController < ApplicationController
  include ActionView::Helpers::AssetUrlHelper
  include ApplicationHelper

  def index 
    @username = logged_in? ? " #{current_user.name}" : ''

    if logged_in?
      @invitation_text_button = 'Invita a tus amigos a encender una luz'
    end

    @title = 'Socialize.App'
    @lights = Light.all.order('lights.id asc').last(5)

  end

end
