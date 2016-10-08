class UsersController < ApplicationController
  # @todo: check for possible errors
  
  def index 
    # @todo: if it is a logged in user > show all users
  end
  
  def show
    # @todo: validate params array

    @user = User.find params[:id]

    unless !request.xhr? 
        render partial: 'users/account_holder'
    end

  end

end