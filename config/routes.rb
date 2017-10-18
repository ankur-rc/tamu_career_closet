Rails.application.routes.draw do
  get '/rentals/viewActive', to: 'rentals#viewActiveUser'
  resources :rentals
  resources :apparels
  resources :students

  root 'students#home'
end
