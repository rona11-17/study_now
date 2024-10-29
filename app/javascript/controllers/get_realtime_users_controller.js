// // app/javascript/controllers/get_realtime_users_controller.js
// import { Controller } from "stimulus";
// import { collection, onSnapshot } from "firebase/firestore";
// import { getFirebaseStore} from "../firebase"

// export default class extends Controller {
//   static targets = ["output"]

//   connect() {
//     console.log("UserListController connected");

//     // Firestoreの初期化
//     const db = getFirebaseStore();

//     // usersコレクションのリアルタイムリスナーを設定
//     const usersCollection = collection(db, "users");

//     // onSnapshotを使ってリアルタイムでデータを取得
//     onSnapshot(usersCollection, (snapshot) => {
//       let users = [];
//       snapshot.forEach((doc) => {
//         users.push({ id: doc.id, ...doc.data() });
//       });
//       this.displayUsers(users);
//     });
//   }

//   displayUsers(users) {
//     const now = new Date();
//     var ellapsed_time;
//     // 取得したユーザー情報をoutputターゲットに表示
//     this.outputTarget.innerHTML = users
//       .filter(user => (user.is_study === 1 || user.is_study === 2))
//       .map(user => {
//         if (user.is_study === 1) {
//           ellapsed_time = now - user.start_time - user.total_pause_duration;
//           return `<p>${user.name} - ${user.is_study} - ${ellapsed_time}</p>`
//         } else if (user.is_study === 2) {
//           ellapsed_time = user.paused_time - user.start_time - user.total_pause_duration;
//           return `<p>${user.name} - ${user.is_study} - ${ellapsed_time}</p>`
//         }
//       })
//       .join("");
//   }
// }

// app/javascript/controllers/get_realtime_users_controller.js
import { Controller } from "stimulus";
import { collection, onSnapshot } from "firebase/firestore";
import { getFirebaseStore } from "../firebase";

export default class extends Controller {
  static targets = ["output"];

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
      this.startTimer(users);
    });
  }

  displayUsers(users) {
    this.users = users; // ユーザー情報を保存
    this.updateDisplay(); // 初期表示を更新
  }

  startTimer(users) {
    this.timer = setInterval(() => {
      this.updateDisplay();
    }, 1000);
  }

  updateDisplay() {
    const now = new Date();
    this.outputTarget.innerHTML = this.users
      .filter(user => (user.is_study === 1 || user.is_study === 2))
      .map(user => {
        let ellapsed_time;
        if (user.is_study === 1) {
          ellapsed_time = ((now - user.start_time.toDate()) - user.total_pause_duration)/1000;
          return `<p>${user.name} - ${user.is_study} - ${ellapsed_time}</p>`
        } else if (user.is_study === 2) {
          ellapsed_time = ((user.paused_time.toDate() - user.start_time.toDate()) - user.total_pause_duration)/1000;
          return `<p>${user.name} - ${user.is_study} - ${ellapsed_time}</p>`
        }
      })
      .join("");
  }

  disconnect() {
    clearInterval(this.timer); // タイマーをクリア
  }
}
