/* ===== UiTM Library — app.js =====
   Features:
   - Login system (hardcoded + registered users)
   - Permanent profile edits saved in localStorage
   - Page protection using localStorage
   - Sample books & users dataset
*/

/* Hardcoded credentials */
const CREDENTIALS = [
  { username: 'admin', password: 'password123', role: 'admin', name: 'Administrator', photo: 'assets/img/default-user.png' },
  { username: 'staff', password: 'staff123', role: 'staff', name: 'Library Staff', photo: 'assets/img/default-user.png' }
];

/* ALERT utility */
function showAlert(containerId, message, type='danger') {
  const c = document.getElementById(containerId);
  if (!c) return;
  c.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>`;
}

/* LOGIN page logic */
if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').addEventListener('submit', function(e){
    e.preventDefault();

    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value;

    let user = null;

    // Hardcoded accounts
    user = CREDENTIALS.find(x => x.username === u && x.password === p);

    // Registered users
    if (!user) {
      const storedUsers = JSON.parse(localStorage.getItem('registeredUsers') || "[]");
      user = storedUsers.find(x => x.username === u && x.password === p);
    }

    if (user) {
      // Save active user
      localStorage.setItem('libraryUser', JSON.stringify(user));

      // Check for saved profile edits
      const savedProfile = JSON.parse(localStorage.getItem('libraryUserProfile'));
      if (savedProfile && savedProfile.username === user.username) {
        const updatedUser = { ...user, ...savedProfile };
        localStorage.setItem('libraryUser', JSON.stringify(updatedUser));
      }

      window.location.href = 'dashboard.html';
    } else {
      showAlert('alert-placeholder', 'Invalid username or password.');
    }
  });
}

/* Page protection */
function requireAuth() {
  const raw = localStorage.getItem('libraryUser');
  if (!raw) {
    window.location.href = 'index.html';
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch(e) {
    localStorage.removeItem('libraryUser');
    window.location.href = 'index.html';
    return null;
  }
}

/* ===== Sample datasets ===== */
const SAMPLE_BOOKS = [
  {id:'B001', title:'To Kill Mockingbird', author:'Harper Lee', category:'Drama', available:4, borrowed:12},
  {id:'B002', title:'1984', author:'Georg Orwell', category:'Political Fiction', available:2, borrowed:8},
  {id:'B003', title:'Pedagogy of The Oppressed', author:'Paulo Freire', category:'Social Theory', available:5, borrowed:7},
  {id:'B004', title:'How Children Learn', author:'John Holt', category:'Education', available:1, borrowed:10},
  {id:'B005', title:'The Montessori Method', author:'Maria Montessori', category:'Education', available:3, borrowed:15},
  {id:'B006', title:'Educational Psychology', author:'Farah Aziz', category:'Education', available:6, borrowed:4},
  {id:'B007', title:'Mindset', author:'Carol Dweck', category:'Cognitive Science', available:2, borrowed:5},
  {id:'B008', title:'Design Thinking', author:'Hannah Lee', category:'Design', available:7, borrowed:6}
];

const SAMPLE_USERS = [
  {id:'U001', name:'Ahmad Bin Ali', role:'Student', borrowed:1},
  {id:'U002', name:'Siti Nur', role:'Student', borrowed:0},
  {id:'U003', name:'Mr. Ramli', role:'Staff', borrowed:2},
  {id:'U004', name:'Nur Aisyah', role:'Student', borrowed:3},
  {id:'U005', name:'CS Lab', role:'Department', borrowed:5}
];

/* Expose globally */
window.SAMPLE_BOOKS = SAMPLE_BOOKS;
window.SAMPLE_USERS = SAMPLE_USERS;
window.requireAuth = requireAuth;
window.showAlert = showAlert;