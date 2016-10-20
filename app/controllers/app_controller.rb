class AppController < ApplicationController
  include ActionView::Helpers::AssetUrlHelper
  include ApplicationHelper

  def index 

    @title = 'ClasiFace.Com'

    puts 'app_controller.index (checking session[:user_id]): ' << session[:user_id].inspect

    # check for json requet
    render partial: 'layouts/main' if request.xhr?

  end

  def static

    puts 'static page'

  end

  # searcher selectors
  def categories_selector
    # validate ajax request
    redirect_to root_url unless request.xhr? 
      # > @todo: show flash message to user: "bad request"

    @categories = Category.all # order

    render partial: 'app/categories_selector'
  end

  def time_selector
    # validate request
    redirect_to root_url unless request.xhr?

    render partial: 'app/time_selector'  
  end

end