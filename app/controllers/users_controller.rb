class UsersController < ApplicationController
  # @todo: check for possible errors
  
  def index 
    # @todo: if it is a logged in user > show all users
  end
  
  def show
    # @todo: validate params array

    @user = User.find params[:id]

    render partial: 'users/user' if request.xhr?

  end

end