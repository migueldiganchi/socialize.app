class AppController < ApplicationController

  def index 
    @username = logged_in? ? " #{current_user.name}" : ''
    if logged_in?
      @invitation_text_button = 'Invita a jugar a tus amigos'
      @facebook_image_url = "http://graph.facebook.com/" + current_user.uid + "/picture?type=normal" 
    end
    @title = 'Socialize.App'
  end

  def save_invitation

    # @todo: read invited users
    # 
    # @todo: save invited users
    # 
    # @todo: return partial rendering invited users    
    
  end

end
