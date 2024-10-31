import { Controller } from "@hotwired/stimulus"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { getFirebaseAuth, getFirebaseStore } from "../firebase"
import { doc, setDoc } from "firebase/firestore"

export default class extends Controller {
  static targets = ["email", "password"]
  
  initialize() {
    this.auth = getFirebaseAuth();
  }

  async register(event) {
    event.preventDefault()

    const email = this.emailTarget.value
    const password = this.passwordTarget.value

    console.log("register controller")

    try {
      // Firebaseでユーザーを登録
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password)
      const uid = userCredential.user.uid

      // Firestoreにユーザのデータ格納
      const db = getFirebaseStore();
      await setDoc(doc(db, "users", uid), {
        name: "test_user",
        is_study: 1
      })

      // Railsバックエンドにユーザーを登録
      const response = await this.createUserOnBackend(uid, email)

      if (response.ok) {
        Turbo.visit("/realtime")
      } else {
        throw new Error("バックエンドでのユーザー登録に失敗しました。")
      }
    } catch (error) {
      console.error("エラー:", error)
      alert("ユーザー登録に失敗しました。")
    }
  }

  async createUserOnBackend(uid, email) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

    return await fetch("/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken
      },
      body: JSON.stringify({ user: {uid: uid, email: email} })
    })
  }
}