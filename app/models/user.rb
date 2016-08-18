class User < ActiveRecord::Base
  has_many :lights
  has_many :pages

  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.provider = auth.provider
      user.uid = auth.uid
      user.name = auth.info.name unless auth.info.nil?
      user.oauth_token = auth.credentials.oauth_token
      user.oauth_expires_at = Time.at(auth.credentials.expires_at)
      user.save!
    end
  end

  def receivers(action: :invite)
    Invitation.where({ origin_fb_uid: self.uid, action: action })
  end

  def remitters(action: :invite)
    Invitation.where({ endpoint_fb_uid: self.uid, action: action })
  end

end
