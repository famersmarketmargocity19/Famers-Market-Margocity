// ═════════════════════════════════════════════════════════════
// 🔥 FIREBASE CONFIGURATION
// ═════════════════════════════════════════════════════════════
// Ganti nilai-nilai ini dengan Firebase config Anda dari console

const firebaseConfig = {
  apiKey: "AIzaSyDemoKeyPleaseReplaceThis12345678901", // ← GANTI INI
  authDomain: "farmers-market-99.firebaseapp.com", // ← GANTI INI
  databaseURL: "https://farmers-market-99-default-rtdb.firebaseio.com", // ← GANTI INI
  projectId: "farmers-market-99", // ← GANTI INI
  storageBucket: "farmers-market-99.appspot.com", // ← GANTI INI
  messagingSenderId: "123456789012", // ← GANTI INI
  appId: "1:123456789012:web:abcdef1234567890" // ← GANTI INI
};

// ═════════════════════════════════════════════════════════════
// Initialize Firebase
// ═════════════════════════════════════════════════════════════
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

console.log("✅ Firebase initialized successfully!");
