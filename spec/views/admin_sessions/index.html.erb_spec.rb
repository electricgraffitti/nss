require 'spec_helper'

describe "admin_sessions/index" do
  before(:each) do
    assign(:admin_sessions, [
      stub_model(AdminSession),
      stub_model(AdminSession)
    ])
  end

  it "renders a list of admin_sessions" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
  end
end
