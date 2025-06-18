// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// Firebase Config (จากที่คุณให้มา)
const firebaseConfig = {
  apiKey: "AIzaSyBSJg9YCROwhDl379glzqyT3Zx7lxGfVp8",
  authDomain: "leaverequest-9cdae.firebaseapp.com",
  projectId: "leaverequest-9cdae",
  storageBucket: "leaverequest-9cdae.appspot.com",
  messagingSenderId: "57035494595",
  appId: "1:57035494595:web:xxxxxxxxxxxx", // ไม่ต้องใส่ก็ได้
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// เปลี่ยน section ตาม hash
const sections = document.querySelectorAll("main section");
function showSection(id) {
  sections.forEach((sec) => {
    sec.style.display = sec.id === id ? "block" : "none";
  });
}
window.addEventListener("hashchange", () => {
  showSection(location.hash.replace("#", "") || "login");
});
showSection(location.hash.replace("#", "") || "login");

// ล็อกอิน
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("✅ เข้าสู่ระบบสำเร็จ");
      location.hash = "#form";
    })
    .catch((err) => {
      alert("❌ ล็อกอินไม่สำเร็จ: " + err.message);
    });
});

// ออกจากระบบ
document.getElementById("logoutBtn").addEventListener("click", () => {
  signOut(auth).then(() => {
    alert("✅ ออกจากระบบแล้ว");
    location.hash = "#login";
  });
});

// ตรวจสอบสถานะ
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("logoutBtn").style.display = "inline-block";
    if (location.hash === "#login" || location.hash === "") {
      location.hash = "#form";
    }
  } else {
    document.getElementById("logoutBtn").style.display = "none";
    location.hash = "#login";
  }
});

// ส่งใบลา
document.getElementById("leaveForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const type = document.getElementById("type").value;
  const date = document.getElementById("date").value;
  const reason = document.getElementById("reason").value.trim();

  try {
    await addDoc(collection(db, "leaveRequests"), {
      name,
      type,
      date,
      reason,
      createdAt: serverTimestamp(),
    });
    alert("✅ ส่งใบลาสำเร็จ");
    document.getElementById("leaveForm").reset();
  } catch (err) {
    alert("❌ เกิดข้อผิดพลาด: " + err.message);
  }
});
