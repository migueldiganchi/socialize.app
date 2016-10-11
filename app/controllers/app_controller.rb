class AppController < ApplicationController
  include ActionView::Helpers::AssetUrlHelper
  include ApplicationHelper

  def index 

    @title = 'ClasiFace.Com'

    # check for json requet
    render partial: 'layouts/main' if request.xhr?
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