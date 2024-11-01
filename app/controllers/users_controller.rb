class UsersController < ApplicationController
  before_action :authenticate
  def index
    @users = User.all
    @user = User.find_by(uid: @uid)
  end

  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)

    if @user.save
      render json: { status: "success" }, status: :created
    else
      render json: { status: "error", errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:uid, :email)
  end
end
