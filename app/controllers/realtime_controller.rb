class RealtimeController < ApplicationController
  before_action :authenticate
  def index
    user = User.find_by(uid: @uid)
    @following_ids = user.following_user_ids
  end
end
