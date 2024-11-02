class RelationshipsController < ApplicationController
  before_action :authenticate
  def create
    @user = User.find_by(uid: @uid)
    @user.follow(params[:user_id])
    redirect_to request.referer
  end
  # フォロー外すとき
  def destroy
    puts "ここからデバッグ"
    puts params
    puts "ここからparams[:relationship][:user_id]"
    puts params[:relationship]
    @user = User.find_by(uid: @uid)
    puts "ここからあんふぉろー"
    @user.unfollow(params[:relationship][:user_id])
    redirect_to request.referer
  end
  # フォロー一覧
  def followings
    user = User.find(params[:user_id])
    @users = user.followings
  end
  # フォロワー一覧
  def followers
    user = User.find(params[:user_id])
    @users = user.followers
  end
end
