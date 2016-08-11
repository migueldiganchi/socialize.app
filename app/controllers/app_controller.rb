class AppController < ApplicationController
  include ActionView::Helpers::AssetUrlHelper
  include ApplicationHelper

  def index 
    @username = logged_in? ? " #{current_user.name}" : ''
    @title = 'My Candel'
    
    # initial lights loading
    @from = 0
    @limit =  8
    @total_lights = Light.get_lights.count
    @paginated_lights = Light.get_paginated_lights @from, @limit
    @show_next_button = (@from + @limit) < @total_lights
    # @todo: get ranekd lights
    @ranked_lights = Light.get_paginated_lights 0, 2 
  end

end