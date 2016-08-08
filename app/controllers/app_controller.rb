class AppController < ApplicationController
  include ActionView::Helpers::AssetUrlHelper
  include ApplicationHelper

  def index 
    @username = logged_in? ? " #{current_user.name}" : ''

    if logged_in?
      @invitation_text_button = 'Invita a tus amigos a encender una luz'
    end

    @title = 'My Candel'
    
    # initial lights loading
    @from = 0
    @limit = 5 # @todo: read from configuration (:per_page)
    @total_lights = Light.get_lights.count
    @paginated_lights = Light.get_paginated_lights @from, @limit
    @show_next_button = (@from + @limit) < @total_lights

  end

end