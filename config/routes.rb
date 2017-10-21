Rails.application.routes.draw do
  resources :rentals
  resources :apparels
  resources :students
  root 'students#home'
  post 'auth/login', to: 'authentication#authenticate'
  post 'signup', to: 'users#create'
end
