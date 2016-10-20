class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  # protect_from_forgery with: :exception
  protect_from_forgery with: :reset_session

  private

    def current_user  
        @current_user ||= User.find session[:app_user_id] if session[:app_user_id]
    end
    
    def current_user?(user) 
      user == current_user
    end

    def logged_in?
      !current_user.nil?
    end

    helper_method :current_user
    helper_method :logged_in?

end