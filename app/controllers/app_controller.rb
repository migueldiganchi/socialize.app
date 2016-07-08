class AppController < ApplicationController

  def index 
    @username = logged_in? ?  current_user.name : "Concursante"
    if logged_in?
      @invitation_text_button = 'Invita una seca a tus amigos'
      @facebook_image_url = "http://graph.facebook.com/" + current_user.uid + "/picture?type=normal" 
    end
    @title = 'Socialize.App'
  end

end
