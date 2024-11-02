class TimelinesController < ApplicationController
  before_action :authenticate
  def index
  end

  def new
    @user = User.find_by(uid: @uid)
  end
end
