// app/javascript/controllers/user_list_controller.js
import { Controller } from "stimulus";
import { collection, onSnapshot } from "firebase/firestore";
import { getFirebaseStore} from "../firebase"

export default class extends Controller {
  static targets = ["output"]

  connect() {
    console.log("UserListController connected");

    // Firestoreの初期化
    const db = getFirebaseStore();

    // usersコレクションのリアルタイムリスナーを設定
    const usersCollection = collection(db, "users");

    // onSnapshotを使ってリアルタイムでデータを取得
    onSnapshot(usersCollection, (snapshot) => {
      let users = [];
      snapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });
      this.displayUsers(users);
    });
  }

  displayUsers(users) {
    // 取得したユーザー情報をoutputターゲットに表示
    this.outputTarget.innerHTML = users
      .filter(user => user.is_study === 0)
      .map(user => `<p>${user.name} - ${user.is_study}</p>`)
      .join("");
  }
}
