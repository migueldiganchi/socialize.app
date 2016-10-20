class SessionsController < ApplicationController
  # before_filter :pirulo
  
  def create

    # begin session
    user = User.from_omniauth(env['omniauth.auth']);
    post = user.posts.build
    session[:app_user_id] = user.id

    # go home 
    if request.xhr?
      render json: { status: true }
    else
      redirect_to root_url
    end
  end

  def destroy

    session[:app_user_id] = nil

    # IMPORTANT: this is made like this because the omniouth-facebook gem is not resolving
    # fine the session cleaning.    
    if request.xhr?
      render json: { status: true }
    else
      redirect_to root_url
    end

  end

  private

  # def pirulo

  #   abort 'pirulin'
    
  # end

end