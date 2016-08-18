class SessionsController < ApplicationController

  def create
    user = User.from_omniauth(env['omniauth.auth']);
    post = user.posts.build
    session[:user_id] = user.id

    @invitation_text_button = 'Invita a tus amigos a dar ideas para cambiar el mundo'
    @from = 0
    @limit = 8 # @todo: read from configuration (:per_page)
    @total_posts = Post.get_posts.count
    @paginated_posts = Post.get_paginated_posts @from, @limit
    @ranked_posts = Post.get_paginated_posts 0, 1 # publishing?
    @show_next_button = (@from + @limit) < @total_posts
    @app_panel = render_to_string partial: 'app/app_panel'
    
    if request.xhr?
      render json: { 
        user: { uid: user.uid, name: user.name }, 
        app_panel: @app_panel 
      }
    else
      redirect_to root_url
    end
  end

  def destroy
    session[:user_id] = nil
    redirect_to root_url
  end

end