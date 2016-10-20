class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  # protect_from_forgery with: :exception
  protect_from_forgery with: :reset_session

  private

    def current_user  

      puts 'sessions_controller.current_user (checking session[:app_user_id]): ' << session[:app_user_id].inspect

      if (user_id = session[:app_user_id])
        @current_user ||= User.find user_id
      end
      
    end
    
    def current_user?(user) 
      user == current_user
    end

    def logged_in?

      puts 'sessions_controller.logged_in? (checking session[:app_user_id]): ' << session[:app_user_id].inspect

      !current_user.nil?

    end

    helper_method :current_user
    helper_method :logged_in?

end