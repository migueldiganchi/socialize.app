class AppController < ApplicationController
  include ActionView::Helpers::AssetUrlHelper
  include ApplicationHelper

  def index 
    @username = logged_in? ? " #{current_user.name}" : ''
    @title = 'My Candel'
    
    # initial posts loading
    @from = 0
    @limit =  8
    @total_posts = Post.get_posts.count
    @paginated_posts = Post.get_paginated_posts @from, @limit
    @show_next_button = (@from + @limit) < @total_posts
    # @todo: get ranekd posts
    @ranked_posts = Post.get_paginated_posts 0, 1
  end

  # searcher selectors
  
  def categories_selector
    # validate request
    redirect_to root_url unless request.xhr?

    @categories = Category.all # order

    render partial: 'app/categories_selector'
  end

  def time_selector
    # validate request
    redirect_to root_url unless request.xhr?

    render partial: 'app/time_selector'  
  end

end