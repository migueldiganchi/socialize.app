module ApplicationHelper

  def facebook_picture_url (fb_uid = nil, type = 'normal', default = 'icons/user-128.png')
    uid = fb_uid.nil? && !current_user.nil? ? current_user.uid : (!fb_uid.nil? ? fb_uid : nil)
    picture_url = uid.nil? ? asset_url(default) : 
      "http://graph.facebook.com/#{uid}/picture?type=#{type}"
  end

end