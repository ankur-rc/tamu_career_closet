Rails.application.routes.draw do



  match '/rentals/viewActive' => 'rentals#view_active_user', via: :get
  match '/rentals/viewCheckedOut' => 'rentals#view_checkedOut', via: :get
  match '/rentals/activeUsersAndCheckedOutApparels' => 'rentals#num_active_users_and_checked_out', via: :get
  match '/apparels/getSizes' => 'apparels#get_sizes', via: :get
  match '/students/new' => 'students#create', via: :post
  match '/students/delete' => 'students#destroy', via: :get
  match '/students/show' => 'students#show', via: :get
  match '/students/update' => 'students#update', via: :post






  get "rentals/pending_returnsAndDefaulters", to: "rentals#pending_returnsAndDefaulters", as: "pendingreturns",:defaults => { :format => 'json' }
  post "rentals/assignsuits", to: "rentals#assignSuits",as: "assignsuits",:default=>{:format=>'json'}
  post "rentals/receiveSuits", to: "rentals#receiveSuits",as: "receiveSuits",:default=>{:format=>'json'}
  get "sendPendingEmails", to: "rentals#sendPendingEmails",:default=>{:format=>'json'}
  get "sendOverDueEmails",  to: "rentals#sendOverDueEmails",:default=>{:format=>'json'}
  get "getConstants", to: "constants#showConstants",:default=>{:format=>'json'}
  post "updateConstants", to:"constants#updateConstant",:default=>{:format=>'json'}
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
