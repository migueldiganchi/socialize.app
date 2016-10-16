Rails.application.routes.draw do
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  root 'app#index'

  match 'auth/:provider/callback',  to: 'sessions#create',      as: 'login',        via: 'get'
  match 'auth/failure',             to: redirect('/'),                              via: 'get' 
  match 'logout',                   to: 'sessions#destroy',     as: 'logout',       via: 'delete'
  match 'ranking',                  to: 'posts#ranking',                            via: 'get'
  match 'create_pages',             to: 'user#create_pages',                        via: 'post'
  match 'categories_selector',      to: 'app#categories_selector',                  via: 'get'
  match 'time_selector',            to: 'app#time_selector',                        via: 'get'

  resources :invitations, only: [:create, :update, :destroy]
  resources :posts
  resources :pages, only: [:create, :index, :show]
  resources :users do
    resources :pages, only: [:index]
  end

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
