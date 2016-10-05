class AppController < ApplicationController
  include ActionView::Helpers::AssetUrlHelper
  include ApplicationHelper

  def index 
    @username = logged_in? ? " #{current_user.name}" : ''
    @title = 'ClasiFace.Com'
    
    # initial posts loading
    @from = 0
    @limit =  8
    @total_posts = Post.get_posts.count
    @paginated_posts = Post.get_paginated_posts @from, @limit
    @show_next_button = (@from + @limit) < @total_posts

    # @todo: get ranekd posts
    @ranked_posts = Post.get_paginated_posts 0, 1

    if request.xhr?
      # check for json requet
      render partial: 'app/app_panel'
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