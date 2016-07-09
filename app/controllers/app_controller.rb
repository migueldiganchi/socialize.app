class AppController < ApplicationController
  include ActionView::Helpers::AssetUrlHelper
  include ApplicationHelper

  def index 
    @username = logged_in? ? " #{current_user.name}" : ''

    if logged_in?
      @invitation_text_button = 'Invita a jugar a tus amigos'
    end

    # abort @facebook_image_url.inspect

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
