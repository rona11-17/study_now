import { Controller } from "@hotwired/stimulus"
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { getFirebaseAuth } from "../firebase"

let idToken = null;
let initialized = false;

export default class extends Controller {
  static targets = [ "email", "password" ]

  static values = {
    require_auth: Boolean,
    uid: String
  }

  initialize() {
    if (initialized) return;

    const auth = getFirebaseAuth();

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        idToken = await user.getIdToken();
      }

      // 認証必要ないページ
      // 認証必要なページで認証情報が成功している場合は後の処理を抜ける
      if(!this.requireAuthValue || user && this.uidValue == user.uid) return;

      // 認証チェック表示、再リクエスト
      if(user && this.uidValue == "") {
        Turbo.visit( location.pathname, { action: "replace" });
        return;
      }

      // 認証必要なページで認証失敗している
      // ログインページにリダイレクト
      Turbo.visit("/", { action: "replace" });
    });

    document.addEventListener("turbo:before-fetch-request", (event) => {
      if (idToken == null) return;
      
      event.preventDefault();
      event.detail.fetchOptions.headers["Authorization"] = "Bearer " + idToken;
      event.detail.resume();
    });
    initialized = true;
  }

  async loginWithEmailAndPassword() {
    try {
      const auth = getFirebaseAuth();
      const email = this.emailTarget.value;
      const password = this.passwordTarget.value;
      await signInWithEmailAndPassword(auth, email, password)
      Turbo.visit("/mypage", { action: "replace" });
    } catch (error) {
      console.log("login error", error)
    }
  }

  async logout() {
    try {
      const auth = getFirebaseAuth();
      await signOut(auth)
    } catch (error) {
      console.log("logout error", error)
    }
  }
}

