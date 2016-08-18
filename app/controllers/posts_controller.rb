class PostsController < ApplicationController
  # @todo: check for sessions & ajax requests

  def index 

    if request.xhr?
      # @todo: searching  
      @from = (params[:from]  && !params[:from].empty?) ? params[:from].to_i : 0
      @limit = (params[:limit] && !params[:limit].empty?) ? params[:limit].to_i : 2 

      # @todo: read @limit from configuration (:per_page)
      @total_posts = Post.get_posts.count
      @paginated_posts = Post.get_paginated_posts @from, @limit
      # @todo: get ranked posts
      @ranked_posts = Post.get_paginated_posts 0, 2 
      @show_next_button = (@from + @limit) < @total_posts
      # abort @show_next_button.inspect
      render partial: 'app/posts', locals: {
        show_next_button: @show_next_button, 
        paginated_posts: @paginated_posts
      }
      
    else
      redirect_to root_url
    end
  end

  def edit  
    # @todo: preconditions > check for params
    @post = Post.find params[:id]
    if request.xhr?
      render partial: 'app/post', locals: { 
        post: @post,
        changing: logged_in? && current_user.id == @post.user.id
      }
    else
      redirect_to root_url
    end
  end

  def show  
    # @todo: preconditions > check for params
    @post = Post.find params[:id]
    
    if request.xhr?
      wrap_post = params.has_key?(:wrap) ? params[:wrap] == 'true' : true
      theather_mode = params.has_key?(:theather) ? params[:theather] == 'true' : false
      if wrap_post
        render partial: 'app/wrapped_post', locals: { post: @post }
      else
        render partial: 'app/post', locals: { 
          post: @post, 
          theather_mode: theather_mode 
        }
      end
    end
    # @todo: handle errors here
  end

  def new
    if request.xhr?
      render 'post', locals: { post: current_user.posts.build }
    else
      redirect_to root_url
    end
  end

  def create
    # create a new post to the current user
    post = current_user.posts.build post_params
    # respond to the user saveing the post
    save_post post
  end

  def update
    # @todo: preconditions > check for params
    # get existing post
    post = post.find params[:id]
    # respond with save_post
    save_post post
  end

  def destroy
    # @todo: check for preconditions params
    post = post.find params[:id]
    if post.update_attribute(:deleted_at, DateTime.now)
       if request.xhr?
        render json: { 
          status: true, 
          message: 'La luz se ha eliminado exitosamente' 
        }
      else
        redirect_to root_url
      end 
    else
      # @todo: handle errors
    end

  end

  def ranking

    # @todo: list of ranking items;
    @ranked_posts = Post.get_paginated_posts 0, 1

    if request.xhr?
      render partial: 'app/posts', locals: { 
        show_next_button: false,
        paginated_posts: @ranked_posts, 
        col_reference: 12, 
        ranked: true
      }
    else
      redirect_to root_url
    end
  end

  private 

    def save_post post

      is_new = post.id.nil? || post.id == 0
      saved = is_new ? post.save : post.update_attributes(post_params)

      if saved
        if request.xhr?
          if is_new
            post_view = render_to_string(
              partial: 'app/wrapped_post', 
              locals: { post: post }
            )
          else
            post_view = render_to_string(
              partial: 'app/post', 
              locals: { post: post }
            )
          end

          # respond the user
          render json: {
            is_new: is_new,
            post: post.to_json, 
            post_view: post_view
          }
        else
          redirect_to root_url
        end

      else
        # @todo: handle error
      end
    end

    def post_params
      params.require(:post).permit(:id, :description);
    end

end