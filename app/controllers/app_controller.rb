class AppController < ApplicationController
  include ActionView::Helpers::AssetUrlHelper
  include ApplicationHelper

  def index 
    @username = logged_in? ? " #{current_user.name}" : ''

    if logged_in?
      @invitation_text_button = 'Invita a jugar a tus amigos'
    end

    @title = 'Socialize.App'
  end

end
