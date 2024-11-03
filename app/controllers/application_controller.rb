class ApplicationController < ActionController::Base
  before_action :set_gon_variables

  def authenticate
    @require_auth = true

    id_token = request.headers["Authorization"]&.split&.last

    if request.method_symbol == :get && id_token.nil?
      render "shared/check_auth", status: 200
      return
    end

    decorded_token = FirebaseAdmin::Client.verify_id_token!(id_token)
    @uid = decorded_token["user_id"]
  end

  def set_gon_variables
    if Rails.env.development?
      firebase_config = {
        apiKey: ENV["FIREBASE_API_KEY"],
        authDomain: ENV["FIREBASE_AUTH_DOMAIN"],
        projectId: ENV["FIREBASE_PROJECT_ID"],
        storageBucket: ENV["FIREBASE_STORAGE_BUCKET"],
        messagingSenderId: ENV["FIREBASE_MESSAGING_SENDER_ID"],
        appId: ENV["FIREBASE_APP_ID"]
      }
      gon.firebase_config = firebase_config
    end
  end
end
