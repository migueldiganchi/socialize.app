class AppController < ApplicationController
  include ActionView::Helpers::AssetUrlHelper
  include ApplicationHelper

  def index 

    @title = 'ClasiFace.Com'

    if request.xhr?
      # check for json requet
      render partial: 'app/app_panel'
    end

  end

  def main
    # @todo: improve this
    
    if request.xhr?
      render partial: 'layouts/main'
    else
      redirect_to root_url
    end
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