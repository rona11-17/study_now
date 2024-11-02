class UsersController < ApplicationController
  #before_action :authenticate
  #ここには要らんかったかも
  def index
    @users = User.all
    @user = User.find_by(uid: @uid)
  end

  def new
    @user = User.new
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
