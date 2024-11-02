import { Controller } from "stimulus";
import { doc, onSnapshot, getDoc, updateDoc } from "firebase/firestore"; 
import { getFirebaseStore } from "../firebase";

export default class extends Controller {
  static targets = ["output"];

  async send(event){
    console.log("hello")
    event.preventDefault();
    this.userUid = this.outputTarget.dataset.exchangeInfoUid
    const text = document.getElementById("Text").value;
    const place = document.getElementById("Place").value;
    const comments = document.getElementById("Comments").value;

    const db = getFirebaseStore();
    const docRef = doc(db, "users", this.userUid);
    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          await updateDoc(docRef, { text: text, place: place, comment: comments });
        } else {
          console.log("There is no user");
        }
      } catch (e) {
        console.log("error", e);
      }
  }
}