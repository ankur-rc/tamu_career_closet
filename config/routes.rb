Rails.application.routes.draw do
  # namespace the controllers without affecting the URI
  # Login and Registration API
  post 'auth/login', to: 'authentication#authenticate'
  post 'signup', to: 'users#create'
  root 'rentals#index'

  scope module: :v1, constraints: ApiVersion.new('v1', true) do
    
    # Rentals API
    get 'rentals', to: 'rentals#index'
    get 'rentals/activeusers', to: 'rentals#view_active_user'
    get 'rentals/checkedout', to: 'rentals#view_checked_out'
    get 'rentals/checkedactive', to: 'rentals#num_active_users_and_checked_out'
    get 'rentals/returns', to: 'rentals#pending_returns'
    get 'rentals/defaulters', to: 'rentals#pending_returns_and_defaulters'
    ####################
    get 'rentals/sendpendingemails', to: 'rentals#send_pending_emails'
    get 'rentals/sendoverdueemails',  to: 'rentals#send_overdue_emails'
    get 'rentals/listreports', to: 'rentals#list_reports'
    get 'rentals/newreport', to: 'rentals#new_report', defaults: { format: :csv }
    get 'rentals/studentbyrental/:apparel_id', to: 'rentals#getstudent'
    ####################
    get 'rentals(/:id)', to: 'rentals#show'
    ####################
    post 'rentals/assign', to: 'rentals#assign_suit'
    post 'rentals/return', to: 'rentals#return_suit'
    get 'rentals/extend/:id', to: 'rentals#extend_rental'
    ####################
    post 'rentals', to: 'rentals#create'
    put 'rentals/:id', to: 'rentals#update'
    delete 'rentals/:id', to: 'rentals#destroy'

    # Students API
    get 'students', to: 'students#index'
    get 'students(/:id)', to: 'students#show'
    post 'students', to: 'students#create'
    put  'students/:id', to: 'students#update'
    delete  'students/:id', to: 'students#destroy'
    
    # Apparels API
    get 'apparels', to: 'apparels#index'
    ###################
    get 'apparels/bysize', to: 'apparels#bysize'
    get 'apparels/bysizeandstock', to: 'apparels#bysize_and_stock'
    get 'apparels/getcheckedoutstock', to: 'apparels#get_stock', :defaults => { :stock => 1 }
    get 'apparels/getavailablestock', to: 'apparels#get_stock', :defaults => { :stock => 0 }
    get 'apparels/getsizes', to: 'apparels#get_sizes'
    ###################
    get 'apparels(/:id)', to: 'apparels#show'
    post 'apparels', to: 'apparels#create'
    put  'apparels/:id', to: 'apparels#update'
    delete  'apparels/:id', to: 'apparels#destroy'

    #Constants API
    get 'constants/getconstants', to: 'constants#show_constants'
    post 'constants/updateconstants', to: 'constants#update_constant'

    resources :constants
    resources :rentals
    resources :apparels
    resources :students
  end
end
