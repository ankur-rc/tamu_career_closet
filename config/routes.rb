Rails.application.routes.draw do
  match '/rentals/viewActive' => 'rentals#viewActiveUser', via: :get
  match '/rentals/viewCheckedOut' => 'rentals#viewCheckedOut', via: :get
  match '/students/new' => 'students#create', via: :post
  match '/students/delete' => 'students#destroy', via: :get
  match '/students/show' => 'students#show', via: :get
  match '/students/update' => 'students#update', via: :post
  resources :rentals
  resources :apparels
  resources :students

  root 'students#home'
end
