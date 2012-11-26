require "spec_helper"

describe AdminSessionsController do
  describe "routing" do

    it "routes to #index" do
      get("/admin_sessions").should route_to("admin_sessions#index")
    end

    it "routes to #new" do
      get("/admin_sessions/new").should route_to("admin_sessions#new")
    end

    it "routes to #show" do
      get("/admin_sessions/1").should route_to("admin_sessions#show", :id => "1")
    end

    it "routes to #edit" do
      get("/admin_sessions/1/edit").should route_to("admin_sessions#edit", :id => "1")
    end

    it "routes to #create" do
      post("/admin_sessions").should route_to("admin_sessions#create")
    end

    it "routes to #update" do
      put("/admin_sessions/1").should route_to("admin_sessions#update", :id => "1")
    end

    it "routes to #destroy" do
      delete("/admin_sessions/1").should route_to("admin_sessions#destroy", :id => "1")
    end

  end
end
