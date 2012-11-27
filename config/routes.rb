Nss::Application.routes.draw do

  # Admin Paths
  match "admin-login" => "admin_sessions#new", as: :admin_login
  match "admin-logout" => "admin_sessions#destroy", as: :admin_logout
  match "admin-dashboard" => "student_setups#show", as: :admin_dashboard

  # API Routes

  # Named Routes
  resources :admins
  resources :admin_sessions

  root to: 'admin_sessions#new'
end
