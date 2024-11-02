class UsersController < ApplicationController
  before_action :authenticate, only: [ :index, :search ]
  def index
    @user = User.find_by(uid: @uid)
    @following_users = @user.followings
  end

  def new
    @user = User.new
  end

  def search
    @user = User.find_by(uid: @uid)
    if params[:name].present?
      users = User.where("name LIKE ?", "%#{params[:name]}") || []
      followed_user_ids = @user.followings.pluck(:uid)
      puts "デバッグ"
      puts followed_user_ids
      @not_follow_users = users.where.not(uid: followed_user_ids)
      puts "デバッグ"
      puts @not_follow_users
    else
      @not_follow_users = []
    end
  end

  def create
    #user_paramsにはsignup_controllerからPOSTで送られてくるbodyの中身が入ってる
    @user = User.new(user_params)

    if @user.save
      render json: { status: "success" }, status: :created
    else
      render json: { status: "error", errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    #登録時に,requireで許可したパラメータしか更新できないようpermitで指定する
    #セキュリティ面で管理者権限とかを守るため
    #rails側がuser_paramsを通さないと新規登録できないようにする
    params.require(:user).permit(:uid, :email, :name)
  end
end
