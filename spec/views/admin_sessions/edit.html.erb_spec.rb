require 'spec_helper'

describe "admin_sessions/edit" do
  before(:each) do
    @admin_session = assign(:admin_session, stub_model(AdminSession))
  end

  it "renders the edit admin_session form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form", :action => admin_sessions_path(@admin_session), :method => "post" do
    end
  end
end
