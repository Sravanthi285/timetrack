const API_URL = 'http://localhost:3000/api';

// Create updated Toast system
function showToast(message, actionText = null, actionCallback = null) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${message}</span>`;

    if (actionText) {
        const actionBtn = document.createElement('span');
        actionBtn.className = 'toast-action';
        actionBtn.innerText = actionText;
        actionBtn.onclick = () => {
            if (actionCallback) actionCallback();
            removeToast(toast);
        };
        toast.appendChild(actionBtn);
    }

    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Auto dismiss
    setTimeout(() => {
        removeToast(toast);
    }, 4000);
}

function removeToast(toast) {
    toast.classList.remove('show');
    toast.addEventListener('transitionend', () => toast.remove());
}

// Override alert with toast for better UX
window.alert = (msg) => showToast(msg);

// Navigation helper
function setActiveLink() {
    const currentPath = window.location.pathname.split('/').pop();
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

// Setup common UI logic on load
document.addEventListener('DOMContentLoaded', () => {
    setActiveLink();
});

// --- Existing Logic Below (Login/Auth) ---

function checkAuth() {
    const user = getUser();
    if (!user) {
        window.location.href = 'login.html';
    }
    return user;
}

function getUser() {
    try {
        return JSON.parse(localStorage.getItem('user'));
    } catch (e) {
        return null;
    }
}

async function logout() {
    await fetch(`${API_URL}/auth/logout`, { method: 'POST' });
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}
