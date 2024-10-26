class MypageController < ApplicationController
  before_action :authenticate

  def index
    @user = User.find_by(uid: @uid)
  end
end
