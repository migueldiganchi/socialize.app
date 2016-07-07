class AppController < ApplicationController

  def index 

    @username = logged_in? ?  current_user.name : "Concursante"

    if logged_in?
      @facebook_image_url = "http://graph.facebook.com/" + current_user.uid + "/picture?type=normal" 
    end

    @title = 'Socialize.App'

  end

end
