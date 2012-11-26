class ApplicationController < ActionController::Base
    protect_from_forgery

    helper :all
    helper_method :current_admin, 
                  :current_admin_session,
                  :require_admin,
                  :require_no_admin,
                  :super_admin, :super?

    private
    
    def current_admin_session
      return @current_admin_session if defined?(@current_admin_session)
      @current_admin_session = AdminSession.find
    end

    def current_admin
      return @current_admin if defined?(@current_admin)
      @current_admin = current_admin_session && current_admin_session.record
    end

    def require_admin
      unless current_admin
        flash[:notice] = "You must be logged in to access this page"
        redirect_to new_admin_session_url
        return false
      end
    end

    def require_no_admin
      if current_admin
        flash[:notice] = "You must be logged out to access this page"
        redirect_to root_path
        return false
      end
    end

    protected

    def super_admin
      unless super?
        return false
      end
    end

    def super?
      authenticate_or_request_with_http_basic do |username, password|
        username == APP['super_user'] && password == APP['super_pass']
      end
    end

end
