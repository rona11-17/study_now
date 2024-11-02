import { Controller } from "@hotwired/stimulus"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { getFirebaseAuth, getFirebaseStore } from "../firebase"
import { doc, setDoc } from "firebase/firestore"

export default class extends Controller {
  static targets = ["name","email", "password"]
  
  initialize() {
    this.auth = getFirebaseAuth();
  }

  async register(event) {
    event.preventDefault()

    const email = this.emailTarget.value
    const password = this.passwordTarget.value
    const name = this.nameTarget.value

    console.log("register controller")

    try {
      // Firebase authenticationに新規登録
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password)
      const uid = userCredential.user.uid

      // Firestoreにユーザのデータ格納
      const db = getFirebaseStore();
      const now = new Date()
      await setDoc(doc(db, "users", uid), {
        uid: uid,
        name: name,
        is_study: 0,
        paused_time: now,
        start_time: now,
        total_pause_duration: 0,
        text:"",
        place:"",
        comment:""
      })

      // Railsバックエンドにユーザーを登録
      const response = await this.createUserOnBackend(uid, email, name)

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

  async createUserOnBackend(uid, email, name) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

    return await fetch("/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken
      },
      body: JSON.stringify({ user: {uid: uid, email: email, name: name} })
    })
  }
}