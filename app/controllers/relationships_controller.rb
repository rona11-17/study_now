class RelationshipsController < ApplicationController
  before_action :authenticate
  def create
    @user = User.find_by(uid: @uid)
    @user.follow(params[:user_id])
    redirect_to request.referer
  end
  # フォロー外すとき
  def destroy
    @user = User.find_by(uid: @uid)
    @user.unfollow(params[:uid])
    redirect_to request.referer
  end
  # フォロー一覧
  def followings
    user = User.find_by(uid: @uid)
    @following_users = user.followings
  end
  # フォロワー一覧
  def followers
    user = User.find_by(uid: @uid)
    @followed_users = user.followers
  end
end
