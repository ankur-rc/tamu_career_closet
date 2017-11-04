Rails.application.routes.draw do



  # match '/rentals/viewActive' => 'rentals#view_active_user', via: :get
  # match '/rentals/viewCheckedOut' => 'rentals#view_checkedOut', via: :get
  # match '/rentals/activeUsersAndCheckedOutApparels' => 'rentals#num_active_users_and_checked_out', via: :get
  # match '/apparels/getSizes' => 'apparels#get_sizes', via: :get
  # match '/students/new' => 'students#create', via: :post
  # match '/students/delete' => 'students#destroy', via: :get
  # match '/students/show' => 'students#show', via: :get
  # match '/students/update' => 'students#update', via: :post

  # get "rentals/pending_returnsAndDefaulters", to: "rentals#pending_returnsAndDefaulters", as: "pendingreturns",:defaults => { :format => 'json' }
  # get "rentals/assignsuits/:studentUIN/:apparelId", to: "rentals#assignSuits",as: "assignsuits",:default=>{:format=>'json'}
  # resources :constants
  # resources :rentals
  # resources :apparels
  # resources :students

  root 'students#home'
  # root 'rentals#index'
  # namespace the controllers without affecting the URI
  scope module: :v1, constraints: ApiVersion.new('v1', true) do
    resources :constants
    resources :rentals
    resources :apparels
    resources :students 
  end
  
  #Login and Registration API
  post 'auth/login', to: 'authentication#authenticate'
  post 'signup', to: 'users#create'
  
  #Rentals API  
  get 'rentals', to: 'rentals#index'
  get 'rentals/(:id)', to: 'rentals#show'
  get 'rentals/activeusers', to: 'rentals#view_active_user'
  get 'rentals/checkedout', to: 'rentals#view_checkedOut'
  get 'rentals/checkedactive', to: 'rentals#num_active_users_and_checked_out'
  get 'rentals/returns', to: 'rentals#pending_returns'
  get 'rentals/defaulters', to: 'rentals#pending_returnsAndDefaulters'
  get 'rentals/assign/(:studentUIN)/(:apparelId)', to: 'rentals#assignSuits'
  post 'rentals', to: 'rentals#create'
  put  'rentals/(:id)', to: 'rentals#update'
  delete  'rentals/(:id)', to: 'rentals#destroy'

  #Students API
  get 'students', to: 'students#index'
  get 'students/(:id)', to: 'students#show'
  post 'students', to: 'students#create'
  put  'students/(:id)', to: 'students#update'
  delete  'students/(:id)', to: 'students#destroy'
  
  #Apparels API
  get 'apparels/(:size)', to: 'apparels#index'
  get 'apparels/(:id)', to: 'apparels#show'
  get 'apparels/getsizes', to: 'rentals#get_sizes'
  post 'apparels', to: 'apparels#create'
  put  'apparels/(:id)', to: 'apparels#update'
  delete  'apparels/(:id)', to: 'apparels#destroy'
  
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html


end
