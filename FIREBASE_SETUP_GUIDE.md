# 🔥 FIREBASE INTEGRATION GUIDE - FARMERS MARKET 99

## 📋 DAFTAR ISI
1. [Setup Firebase Project](#setup-firebase-project)
2. [Get Firebase Credentials](#get-firebase-credentials)
3. [Update Config File](#update-config-file)
4. [Integrate dengan Website](#integrate-dengan-website)
5. [Database Rules](#database-rules)
6. [Testing & Troubleshooting](#testing--troubleshooting)

---

## 🚀 Setup Firebase Project

### STEP 1: Buat Project Baru di Firebase

1. **Buka Firebase Console**: https://console.firebase.google.com/
2. Klik tombol **"Add project"** (+ tanda plus)
3. Isi form:
   - **Project name**: `farmers-market-99`
   - Centang persetujuan
   - Klik **Create Project**
4. Tunggu proses selesai (±1-2 menit)

### STEP 2: Daftarkan Web App

1. Di halaman project overview, klik ikon **</> (Web)**
2. Isi **App name**: `Farmers Market Website`
3. Centang "Also set up Firebase Hosting for this app" (opsional)
4. Klik **Register app**
5. **JANGAN KLIK "Next"** dulu - copy dulu config-nya!

---

## 🔑 Get Firebase Credentials

### STEP 3: Copy Firebase Config

Setelah register app, Anda akan melihat code seperti ini:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDemoKey...",
  authDomain: "farmers-market-99.firebaseapp.com",
  databaseURL: "https://farmers-market-99-default-rtdb.firebaseio.com",
  projectId: "farmers-market-99",
  storageBucket: "farmers-market-99.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

**COPY SEMUA DATA INI** - Anda akan memerlukannya di langkah berikutnya!

### STEP 4: Setup Realtime Database

1. Di menu sebelah kiri, klik **Build** > **Realtime Database**
2. Klik **Create Database**
3. Pilih region:
   - Recommended: **asia-southeast1** (Singapura - terdekat dengan Indonesia)
   - Atau **asia-northeast1** (Tokyo)
4. Pilih **Start in test mode** (untuk development)
5. Klik **Create**
6. Tunggu database siap (±1 menit)

**COPY Database URL-nya** - Format: `https://YOUR-PROJECT-ID-default-rtdb.firebaseio.com`

---

## ⚙️ Update Config File

### STEP 5: Update `firebase-config.js`

1. Buka file `firebase-config.js` di repository
2. Ganti placeholder dengan data Anda:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // ← Dari Firebase
  authDomain: "farmers-market-99.firebaseapp.com", // ← Dari Firebase
  databaseURL: "https://farmers-market-99-default-rtdb.firebaseio.com", // ← Dari Firebase
  projectId: "farmers-market-99", // ← Dari Firebase
  storageBucket: "farmers-market-99.appspot.com", // ← Dari Firebase
  messagingSenderId: "123456789012", // ← Dari Firebase
  appId: "1:123456789012:web:abcdef1234567890" // ← Dari Firebase
};
```

3. **Push ke GitHub** - File akan otomatis terupdate di website

---

## 🌐 Integrate dengan Website

### STEP 6: Update `index.html`

Tambahkan Firebase scripts di section `<head>` sebelum `</head>`:

```html
<!-- ══ FIREBASE SDK ══ -->
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js"></script>

<!-- ══ FIREBASE CONFIG ══ -->
<script src="firebase-config.js"></script>

<!-- ══ FIREBASE HANDLERS ══ -->
<script src="firebase-handlers.js"></script>
```

**LOKASI PENTING**: Harus di antara `<head>` dan `</head>`, SEBELUM script lain!

### STEP 7: Update Chat Function

Di file `index.html`, cari function `sendChat()` dan update:

```javascript
function sendChat() {
  const input = document.getElementById('chatInput');
  const query = input.value.trim();
  
  if (!query) return;
  
  // ✅ SIMPAN SEARCH QUERY
  saveSearchQuery(query, 1);
  
  // Rest of the function...
}
```

### STEP 8: Update Comment Submission

Cari form komentar dan update:

```javascript
// Ketika user submit komentar
function submitComment() {
  const name = document.getElementById('commentName').value;
  const comment = document.getElementById('commentText').value;
  const rating = document.getElementById('commentRating').value;
  
  if (name && comment) {
    // ✅ SIMPAN KE FIREBASE
    saveCommentToFirebase(name, comment, parseInt(rating));
    
    // Clear form
    document.getElementById('commentName').value = '';
    document.getElementById('commentText').value = '';
    
    alert('✅ Komentar berhasil dikirim!');
  }
}
```

### STEP 9: Load Comments on Page

Di `window.onload` atau `DOMContentLoaded`:

```javascript
document.addEventListener('DOMContentLoaded', function() {
  // ✅ TRACK VISITOR
  trackVisitorStats();
  
  // ✅ LOAD COMMENTS
  loadCommentsFromFirebase((comments) => {
    const commentList = document.getElementById('commentList');
    commentList.innerHTML = '';
    
    comments.forEach(c => {
      const stars = '⭐'.repeat(c.rating);
      commentList.innerHTML += `
        <div class="ci">
          <div class="cn">${c.name} ${stars}</div>
          <div class="ct">${c.comment}</div>
          <div class="ctime">${new Date(c.timestamp).toLocaleDateString('id-ID')}</div>
        </div>
      `;
    });
  });
});
```

---

## 🔐 Database Rules

### STEP 10: Set Security Rules

1. Di Firebase Console, buka **Realtime Database**
2. Klik tab **Rules**
3. Ganti dengan rules ini:

```json
{
  "rules": {
    "chat_messages": {
      ".read": true,
      ".write": true,
      "$uid": {
        ".validate": "newData.hasChildren(['user', 'bot', 'timestamp'])"
      }
    },
    "comments": {
      ".read": true,
      ".write": true,
      "$uid": {
        ".validate": "newData.hasChildren(['name', 'comment', 'rating', 'timestamp'])"
      }
    },
    "visitors": {
      ".read": true,
      ".write": true
    },
    "search_queries": {
      ".read": true,
      ".write": true
    },
    "product_clicks": {
      ".read": true,
      ".write": true
    },
    "contact_messages": {
      ".read": "root.child('admins').child(auth.uid).exists()",
      ".write": true
    },
    "products": {
      ".read": true,
      ".write": false
    },
    "store_config": {
      ".read": true,
      ".write": false
    }
  }
}
```

4. Klik **Publish**

---

## 🧪 Testing & Troubleshooting

### Test 1: Cek Firebase Connection

Buka Browser Console (F12) dan jalankan:

```javascript
// Test koneksi
console.log(firebase.apps.length > 0 ? "✅ Firebase Connected" : "❌ Firebase Not Connected");

// Test write
db.ref('test').set({message: "Hello Firebase"}).then(() => {
  console.log("✅ Write Success");
}).catch(e => console.error("❌ Write Error:", e));

// Test read
db.ref('test').once('value').then(snap => {
  console.log("✅ Read Success:", snap.val());
}).catch(e => console.error("❌ Read Error:", e));
```

### Test 2: Check Console Logs

Buka website dan buka Browser Console (F12), lihat:

```
✅ Firebase initialized successfully!
✅ Chat message saved to Firebase
✅ Visitor tracked
✅ Loaded X comments from Firebase
```

### Common Issues & Solutions

| Masalah | Solusi |
|---------|--------|
| ❌ `firebase is not defined` | Pastikan `firebase-config.js` di-load SEBELUM script lain |
| ❌ `Cannot read property 'database'` | Pastikan SDK database sudah di-include |
| ❌ `PERMISSION_DENIED` | Check Firebase Rules - set ke test mode dulu |
| ❌ Data tidak muncul | Buka Firebase Console → Database, pastikan data ada |
| ❌ Error CORS | Tidak perlu khawatir - Firebase handle CORS otomatis |

---

## 📊 Monitoring Firebase Console

### Lihat Data Real-Time

1. Buka Firebase Console → **Realtime Database**
2. Klik tab **Data**
3. Lihat struktur JSON:
   ```
   ├── chat_messages
   ├── comments
   ├── visitors
   ├── search_queries
   ├── product_clicks
   ├── contact_messages
   └── products
   ```

### Monitor Usage

1. Klik tab **Usage**
2. Lihat:
   - Simultaneous connections
   - Downloaded data (GB/bulan)
   - Stored data (GB)

Free tier limit:
- ✅ 100 concurrent connections
- ✅ 1 GB storage
- ✅ 10 GB/month downloads

---

## 🎯 Next Steps

### Setelah Integrasi Dasar:

1. ✅ **Add Authentication** (Login/Register)
   - Lihat: `firebase-auth-setup.md` (akan dibuat)

2. ✅ **Backup Data**
   - Export dari Firebase Console regularly

3. ✅ **Setup Monitoring**
   - Enable Firebase Analytics

4. ✅ **Add More Features**
   - Product inventory management
   - Order tracking
   - User profiles

---

## 📚 Resources & Documentation

- **Firebase Official**: https://firebase.google.com/docs/database
- **Firebase Realtime Database Guide**: https://firebase.google.com/docs/database/web/start
- **Firebase Rules Guide**: https://firebase.google.com/docs/database/security
- **Pricing Info**: https://firebase.google.com/pricing

---

## ✅ CHECKLIST SETUP

- [ ] Buat Firebase Project
- [ ] Daftarkan Web App
- [ ] Copy Firebase Config
- [ ] Create Realtime Database
- [ ] Update `firebase-config.js` dengan credentials
- [ ] Update `index.html` dengan Firebase scripts
- [ ] Update Database Rules
- [ ] Test connection via Console
- [ ] Cek data di Firebase Console
- [ ] Website berfungsi normal + data tersimpan

---

## 🚀 Deployment

Setelah semua setup selesai:

```bash
# 1. Push ke GitHub
git add .
git commit -m "Integrate Firebase backend"
git push origin main

# 2. Website update otomatis (5-30 detik)
# 3. Test di https://famersmarketmargocity19.github.io/Famers-Market-Margocity/
```

---

**SELESAI! 🎉 Website Anda sekarang fully interactive dengan Firebase!**

Untuk pertanyaan lebih lanjut, lihat file dokumentasi lainnya atau buka issue di GitHub.

**Last Updated**: 15 Juni 2026
**Status**: ✅ Ready for Implementation
