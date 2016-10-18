OmniAuth.config.logger = Rails.logger

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :facebook, 
    ENV['FACEBOOK_KEY'], 
    ENV['FACEBOOK_SECRET'],
    scope: ENV['FACEBOOK_SCOPE'], 
    display: 'popup',
    provider_ignores_state: true
end