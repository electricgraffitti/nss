require 'spec_helper'

describe "admin_sessions/show" do
  before(:each) do
    @admin_session = assign(:admin_session, stub_model(AdminSession))
  end

  it "renders attributes in <p>" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
  end
end
