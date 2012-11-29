class Admin < ActiveRecord::Base

  attr_accessible :email, :first_name, :last_name, :password, :password_confirmation

  # Authlogic
  acts_as_authentic do |c|
    c.login_field(:email)
  end

  # Methods

  def name
  	"#{first_name} #{last_name}"
  end

end
