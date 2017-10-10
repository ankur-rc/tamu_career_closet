Rails.application.routes.draw do
  resources :rentals
  resources :apparels
  resources :students

  root 'students#home'
end
