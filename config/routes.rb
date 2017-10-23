Rails.application.routes.draw do


<<<<<<< HEAD
  match '/rentals/viewActive' => 'rentals#view_active_user', via: :get
  match '/rentals/viewCheckedOut' => 'rentals#view_checkedOut', via: :get
  match '/rentals/activeUsersAndCheckedOutApparels' => 'rentals#num_active_users_and_checked_out', via: :get
  match '/apparels/getSizes' => 'apparels#get_sizes', via: :get
  match '/students/new' => 'students#create', via: :post
  match '/students/delete' => 'students#destroy', via: :get
  match '/students/show' => 'students#show', via: :get
  match '/students/update' => 'students#update', via: :post


  get "rentals/pendingreturns", to: "rentals#pending_returns", as: "pendingreturns",:defaults => { :format => 'json' }



  get "rentals/pending_returnsAndDefaulters", to: "rentals#pending_returnsAndDefaulters", as: "pendingreturns",:defaults => { :format => 'json' }
  get "rentals/assignsuits/:studentUIN/:apparelId", to: "rentals#assignSuits",as: "assignsuits",:default=>{:format=>'json'}
  resources :constants

  resources :rentals

  resources :apparels
  resources :students

  root 'students#home'
  # root 'rentals#index'
  post 'auth/login', to: 'authentication#authenticate'
  post 'signup', to: 'users#create'



  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html


end
