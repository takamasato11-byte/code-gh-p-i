// Main.js - Core Application Logic with Full Interactivity

// ===== DATA STORAGE =====
const DataStore = {
  // User Data
  saveUser(userData) {
    localStorage.setItem('currentUser', JSON.stringify(userData));
  },
  
  getUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },
  
  // Posts
  savePosts(posts) {
    localStorage.setItem('allPosts', JSON.stringify(posts));
  },
  
  getPosts() {
    const posts = localStorage.getItem('allPosts');
    return posts ? JSON.parse(posts) : [];
  },
  
  addPost(postData) {
    const posts = this.getPosts();
    const newPost = {
      id: this.generateId(),
      ...postData,
      createdAt: new Date().getTime(),
      likes: 0
    };
    posts.unshift(newPost);
    this.savePosts(posts);
    return newPost;
  },
  
  // Likes/Matches
  saveLikes(likes) {
    localStorage.setItem('userLikes', JSON.stringify(likes));
  },
  
  getLikes() {
    const likes = localStorage.getItem('userLikes');
    return likes ? JSON.parse(likes) : [];
  },
  
  // Preferences
  savePreferences(prefs) {
    localStorage.setItem('userPrefs', JSON.stringify(prefs));
  },
  
  getPreferences() {
    const prefs = localStorage.getItem('userPrefs');
    return prefs ? JSON.parse(prefs) : { ageMin: 18, ageMax: 65, distance: 50 };
  },
  
  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
};

// ===== DARK MODE =====
const darkModeToggle = document.getElementById('darkModeToggle');

function toggleDarkMode() {
  const isDarkMode = document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
  darkModeToggle.textContent = isDarkMode ? '☀️' : '🌙';
}

// Initialize dark mode from localStorage
if (localStorage.getItem('darkMode') === 'enabled') {
  document.body.classList.add('dark-mode');
  if (darkModeToggle) darkModeToggle.textContent = '☀️';
}

if (darkModeToggle) {
  darkModeToggle.addEventListener('click', toggleDarkMode);
  darkModeToggle.style.cursor = 'pointer';
  darkModeToggle.style.border = 'none';
  darkModeToggle.style.background = 'rgba(255,255,255,0.2)';
  darkModeToggle.style.padding = '8px 12px';
  darkModeToggle.style.borderRadius = '8px';
  darkModeToggle.style.color = 'white';
  darkModeToggle.style.fontSize = '16px';
  darkModeToggle.style.transition = 'all 0.3s ease';
}

// ===== NOTIFICATIONS =====
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.style.position = 'fixed';
  notification.style.top = '100px';
  notification.style.right = '20px';
  notification.style.zIndex = '9999';
  notification.style.maxWidth = '400px';
  notification.style.padding = '16px 20px';
  notification.style.background = type === 'success' ? '#4caf50' : (type === 'error' ? '#f44336' : '#2196F3');
  notification.style.color = 'white';
  notification.style.borderRadius = '8px';
  notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
  notification.innerHTML = `
    <span>${message}</span>
    <span class="notification-close" onclick="this.parentElement.remove();" style="margin-left: 10px; cursor: pointer;">✕</span>
  `;
  document.body.appendChild(notification);

  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 4000);
}

// ===== USER AUTHENTICATION =====
const AuthManager = {
  login(username, password) {
    if (!username || !password) {
      showNotification('Vui lòng điền tất cả các trường', 'error');
      return false;
    }
    
    const userData = {
      username: username,
      email: username.includes('@') ? username : username + '@example.com',
      age: 24,
      location: 'TP. Hồ Chí Minh',
      bio: 'Người dùng mới trên Cute Match',
      interests: ['Du Lịch', 'Âm Nhạc', 'Cà Phê'],
      avatar: Math.random() > 0.5 ? '👩' : '👨',
      createdAt: new Date().getTime()
    };
    
    DataStore.saveUser(userData);
    showNotification(`Chào mừng, ${username}! 👋`, 'success');
    
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
    
    return true;
  },
  
  logout() {
    localStorage.removeItem('currentUser');
    showNotification('Đã đăng xuất thành công.', 'success');
    setTimeout(() => {
      window.location.href = 'account.html';
    }, 1500);
  },
  
  isLoggedIn() {
    return DataStore.getUser() !== null;
  },
  
  getCurrentUser() {
    return DataStore.getUser();
  }
};

// ===== FORM HANDLERS =====

// Login Form Handler
if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    AuthManager.login(username, password);
  });
}

// Signup Form Handler
if (document.getElementById('signupForm')) {
  document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('password2').value;
    const confirmPassword = document.getElementById('password3').value;
    
    if (!username || !email || !password || !confirmPassword) {
      showNotification('Vui lòng điền tất cả các trường', 'error');
      return;
    }
    
    if (password !== confirmPassword) {
      showNotification('Mật khẩu không khớp', 'error');
      return;
    }
    
    if (password.length < 6) {
      showNotification('Mật khẩu phải có ít nhất 6 ký tự', 'error');
      return;
    }
    
    const userData = {
      username: username,
      email: email,
      age: parseInt(document.getElementById('age').value) || 24,
      location: document.getElementById('city').value || 'TP. Hồ Chí Minh',
      bio: document.getElementById('bio').value || 'Người dùng mới trên Cute Match',
      interests: Array.from(document.querySelectorAll('#signupForm input[type="checkbox"]:checked')).map(cb => cb.value),
      avatar: Math.random() > 0.5 ? '👩' : '👨',
      createdAt: new Date().getTime()
    };
    
    DataStore.saveUser(userData);
    showNotification(`Đăng ký thành công! Chào mừng, ${username}!`, 'success');
    
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  });
}

// Profile Edit Form Handler
if (document.getElementById('editProfileForm')) {
  document.getElementById('editProfileForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const user = AuthManager.getCurrentUser();
    
    if (!user) {
      showNotification('Vui lòng đăng nhập trước', 'error');
      return;
    }
    
    user.bio = document.getElementById('bioInput').value || user.bio;
    user.age = parseInt(document.getElementById('ageInput').value) || user.age;
    user.location = document.getElementById('locationInput').value || user.location;
    user.interests = document.getElementById('interestsInput').value.split(',').map(i => i.trim());
    
    DataStore.saveUser(user);
    showNotification('Hồ sơ đã được cập nhật! ✨', 'success');
  });
}

// ===== POST CREATION =====
if (document.getElementById('postForm')) {
  document.getElementById('postForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const user = AuthManager.getCurrentUser();
    
    if (!user) {
      showNotification('Vui lòng đăng nhập để tạo bài viết', 'error');
      return;
    }
    
    const content = document.getElementById('postContent').value;
    
    if (!content.trim()) {
      showNotification('Vui lòng viết điều gì đó! 💭', 'error');
      return;
    }
    
    const post = DataStore.addPost({
      author: user.username,
      avatar: user.avatar,
      content: content,
      location: user.location
    });
    
    document.getElementById('postContent').value = '';
    showNotification('Bài viết đã chia sẻ! 🎉', 'success');
    
    // Reload posts display if on feed page
    if (window.loadPosts) {
      window.loadPosts();
    }
  });
}

// ===== MATCHING SYSTEM =====
const MatchingSystem = {
  likeUser(userId, userName) {
    const user = AuthManager.getCurrentUser();
    if (!user) {
      showNotification('Vui lòng đăng nhập', 'error');
      return;
    }
    
    const likes = DataStore.getLikes();
    if (!likes.find(like => like.id === userId)) {
      likes.push({ id: userId, name: userName, likedAt: new Date().getTime() });
      DataStore.saveLikes(likes);
      showNotification(`Bạn thích ${userName}! ❤️`, 'success');
    } else {
      showNotification(`Bạn đã thích ${userName} rồi! 💕`, 'info');
    }
  },
  
  skipUser(userName) {
    showNotification(`Bỏ qua ${userName} ⏭️`, 'info');
  },
  
  getMatches() {
    return DataStore.getLikes();
  }
};

// ===== MODAL UTILITIES =====
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'flex';
    modal.classList.add('active');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('active');
  }
}

// Close modal when clicking outside
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('active');
    e.target.style.display = 'none';
  }
});

// Close modal with close button
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-close')) {
    e.target.closest('.modal').classList.remove('active');
    e.target.closest('.modal').style.display = 'none';
  }
});

// ===== TAB SWITCHING =====
function setupTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      
      // Remove active from all buttons and contents
      tabButtons.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      // Add active to clicked button and corresponding content
      btn.classList.add('active');
      const content = document.getElementById(tabId);
      if (content) {
        content.classList.add('active');
        content.style.display = 'block';
      }
    });
  });
  
  // Ensure first tab is visible on load
  const firstTab = document.querySelector('.tab-content');
  if (firstTab) {
    firstTab.style.display = 'block';
  }
}

// ===== FORM VALIDATION =====
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePassword(password) {
  return password.length >= 6;
}

function validateUsername(username) {
  return username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
}

// ===== MATCH NOTIFICATIONS =====
function checkForNewMatches() {
  const hasNewMatches = Math.random() > 0.7;
  if (hasNewMatches && Math.random() > 0.5) {
    showNotification('💕 Bạn có người hẹn mới!', 'success');
  }
}

// Check for new matches every 30 seconds
setInterval(checkForNewMatches, 30000);

// ===== UTILITY FUNCTIONS =====

// Format time ago
function timeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;

  if (interval > 1) return Math.floor(interval) + ' năm trước';
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' tháng trước';
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' ngày trước';
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' giờ trước';
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' phút trước';
  return Math.floor(seconds) + ' giây trước';
}

// Generate random ID
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// Shuffle array
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  
  // Show user info if logged in
  const user = AuthManager.getCurrentUser();
  if (user && document.querySelector('.user-info')) {
    document.querySelector('.user-info').innerHTML = `${user.avatar} ${user.username}`;
  }
});

// ===== EXPORT FOR USE IN OTHER SCRIPTS =====
window.showNotification = showNotification;
window.openModal = openModal;
window.closeModal = closeModal;
window.AuthManager = AuthManager;
window.DataStore = DataStore;
window.MatchingSystem = MatchingSystem;
window.validateEmail = validateEmail;
window.validatePassword = validatePassword;
window.validateUsername = validateUsername;
