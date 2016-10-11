class SessionsController < ApplicationController
  # @todo: handle errors

  def create

    # begin session
    user = User.from_omniauth(env['omniauth.auth']);
    post = user.posts.build
    session[:user_id] = user.id

    # go home 
    redirect_to root_url
  end

  def destroy
    session[:user_id] = nil
    redirect_to root_url
  end

end