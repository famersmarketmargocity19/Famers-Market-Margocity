// ═════════════════════════════════════════════════════════════
// 🔥 FIREBASE DATA HANDLERS
// ═════════════════════════════════════════════════════════════

// ──────────────────────────────────────────────────────────────
// 1️⃣ SIMPAN CHAT MESSAGES KE FIREBASE
// ──────────────────────────────────────────────────────────────
function saveChatMessage(userMessage, botResponse) {
  const timestamp = new Date().toISOString();
  const messageRef = db.ref('chat_messages').push();
  
  messageRef.set({
    user: userMessage,
    bot: botResponse,
    timestamp: timestamp,
    visitor_ip: 'anonymous' // bisa ditambah IP detection nanti
  }).then(() => {
    console.log("✅ Chat message saved to Firebase");
  }).catch((error) => {
    console.error("❌ Error saving chat:", error);
  });
}

// ──────────────────────────────────────────────────────────────
// 2️⃣ SIMPAN PRODUK KE FIREBASE
// ──────────────────────────────────────────────────────────────
function saveProductToFirebase(product) {
  const timestamp = new Date().toISOString();
  const productRef = db.ref('products').push();
  
  productRef.set({
    ...product,
    added_date: timestamp,
    views: 0,
    clicks: 0
  }).then(() => {
    console.log("✅ Product saved:", product.name);
  }).catch((error) => {
    console.error("❌ Error saving product:", error);
  });
}

// ──────────────────────────────────────────────────────────────
// 3️⃣ AMBIL SEMUA PRODUK DARI FIREBASE
// ──────────────────────────────────────────────────────────────
function loadProductsFromFirebase(callback) {
  db.ref('products').on('value', (snapshot) => {
    const products = [];
    snapshot.forEach((childSnapshot) => {
      products.push({
        id: childSnapshot.key,
        ...childSnapshot.val()
      });
    });
    callback(products);
    console.log(`✅ Loaded ${products.length} products from Firebase`);
  }, (error) => {
    console.error("❌ Error loading products:", error);
  });
}

// ──────────────────────────────────────────────────────────────
// 4️⃣ SIMPAN KOMENTAR & RATING
// ──────────────────────────────────────────────────────────────
function saveCommentToFirebase(name, comment, rating) {
  const timestamp = new Date().toISOString();
  const commentRef = db.ref('comments').push();
  
  commentRef.set({
    name: name,
    comment: comment,
    rating: rating,
    timestamp: timestamp,
    approved: false // untuk moderasi
  }).then(() => {
    console.log("✅ Comment saved to Firebase");
  }).catch((error) => {
    console.error("❌ Error saving comment:", error);
  });
}

// ──────────────────────────────────────────────────────────────
// 5️⃣ AMBIL KOMENTAR DARI FIREBASE
// ──────────────────────────────────────────────────────────────
function loadCommentsFromFirebase(callback) {
  db.ref('comments').orderByChild('timestamp').limitToLast(50).on('value', (snapshot) => {
    const comments = [];
    snapshot.forEach((childSnapshot) => {
      const comment = childSnapshot.val();
      // Hanya tampilkan komentar yang sudah di-approve
      if (comment.approved !== false) {
        comments.push({
          id: childSnapshot.key,
          ...comment
        });
      }
    });
    callback(comments.reverse()); // Most recent first
    console.log(`✅ Loaded ${comments.length} comments from Firebase`);
  }, (error) => {
    console.error("❌ Error loading comments:", error);
  });
}

// ──────────────────────────────────────────────────────────────
// 6️⃣ TRACK VISITOR STATISTICS
// ──────────────────────────────────────────────────────────────
function trackVisitorStats() {
  const timestamp = new Date().toISOString();
  const visitorRef = db.ref('visitors').push();
  
  visitorRef.set({
    timestamp: timestamp,
    page: window.location.pathname,
    user_agent: navigator.userAgent,
    referrer: document.referrer || 'direct',
    resolution: `${window.innerWidth}x${window.innerHeight}`
  }).then(() => {
    console.log("✅ Visitor tracked");
  }).catch((error) => {
    console.error("❌ Error tracking visitor:", error);
  });
}

// ──────────────────────────────────────────────────────────────
// 7️⃣ AMBIL STATISTIK PENGUNJUNG
// ──────────────────────────────────────────────────────────────
function getVisitorStats(callback) {
  db.ref('visitors').on('value', (snapshot) => {
    const visitors = [];
    snapshot.forEach((childSnapshot) => {
      visitors.push(childSnapshot.val());
    });
    callback(visitors);
    console.log(`✅ Total visitors: ${visitors.length}`);
  }, (error) => {
    console.error("❌ Error loading stats:", error);
  });
}

// ──────────────────────────────────────────────────────────────
// 8️⃣ SIMPAN SEARCH QUERY (untuk analytics)
// ──────────────────────────────────────────────────────────────
function saveSearchQuery(query, results_found) {
  const timestamp = new Date().toISOString();
  const searchRef = db.ref('search_queries').push();
  
  searchRef.set({
    query: query,
    results_count: results_found,
    timestamp: timestamp
  }).then(() => {
    console.log("✅ Search query saved");
  }).catch((error) => {
    console.error("❌ Error saving search:", error);
  });
}

// ──────────────────────────────────────────────────────────────
// 9️⃣ SIMPAN FORM KONTAK KE FIREBASE
// ──────────────────────────────────────────────────────────────
function saveContactForm(name, email, message) {
  const timestamp = new Date().toISOString();
  const contactRef = db.ref('contact_messages').push();
  
  contactRef.set({
    name: name,
    email: email,
    message: message,
    timestamp: timestamp,
    read: false
  }).then(() => {
    console.log("✅ Contact form saved");
  }).catch((error) => {
    console.error("❌ Error saving contact form:", error);
  });
}

// ──────────────────────────────────────────────────────────────
// 🔟 TRACK PRODUCT CLICK
// ──────────────────────────────────────────────────────────────
function trackProductClick(productId, productName) {
  const timestamp = new Date().toISOString();
  const clickRef = db.ref('product_clicks').push();
  
  clickRef.set({
    product_id: productId,
    product_name: productName,
    timestamp: timestamp
  }).then(() => {
    console.log("✅ Product click tracked");
  }).catch((error) => {
    console.error("❌ Error tracking click:", error);
  });
}

// ──────────────────────────────────────────────────────────────
// 1️⃣1️⃣ UPDATE REAL-TIME VISITOR COUNT
// ──────────────────────────────────────────────────────────────
function updateRealtimeVisitorCount(elementId) {
  db.ref('visitors').limitToLast(1).on('child_added', () => {
    db.ref('visitors').on('value', (snapshot) => {
      const count = snapshot.numChildren();
      const element = document.getElementById(elementId);
      if (element) {
        element.textContent = count.toLocaleString();
      }
    });
  });
}

// ──────────────────────────────────────────────────────────────
// 1️⃣2️⃣ SYNC STORE HOURS (untuk hari/jam yang berbeda)
// ──────────────────────────────────────────────────────────────
function loadStoreHoursFromFirebase(callback) {
  db.ref('store_config/hours').on('value', (snapshot) => {
    const hours = snapshot.val() || {
      monday: "09:00 - 22:00",
      tuesday: "09:00 - 22:00",
      wednesday: "09:00 - 22:00",
      thursday: "09:00 - 22:00",
      friday: "09:00 - 22:00",
      saturday: "09:00 - 22:00",
      sunday: "09:00 - 22:00"
    };
    callback(hours);
    console.log("✅ Store hours loaded");
  });
}

// ──────────────────────────────────────────────────────────────
// EXPORT untuk digunakan di file lain
// ──────────────────────────────────────────────────────────────
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    saveChatMessage,
    saveProductToFirebase,
    loadProductsFromFirebase,
    saveCommentToFirebase,
    loadCommentsFromFirebase,
    trackVisitorStats,
    getVisitorStats,
    saveSearchQuery,
    saveContactForm,
    trackProductClick,
    updateRealtimeVisitorCount,
    loadStoreHoursFromFirebase
  };
}
