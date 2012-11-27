class StudentSetupsController < ApplicationController

	before_filter :require_admin

  def show
  	@page_title = "Student Setup"
  end
end
