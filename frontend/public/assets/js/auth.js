// auth.js - Authentication related functions

/**
 * Initialize authentication forms and handlers
 */
document.addEventListener('DOMContentLoaded', function() {
    initAuthForms();
    checkAuthState();
});

/**
 * Initialize all authentication forms on the page
 */
function initAuthForms() {
    // Register form handler
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Login form handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

/**
 * Handle registration form submission
 * @param {Event} e - Form submit event
 */
async function handleRegister(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const formData = getFormData(form);
    
    try {
        // Disable button during submission
        submitBtn.disabled = true;
        submitBtn.textContent = 'Registering...';
        
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: formData.name.trim(),
                email: formData.email.trim(),
                password: formData.password // Don't trim password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        // Store authentication data
        storeAuthData(data.token, data.user);
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
        
    } catch (error) {
        showAlert(error.message || 'An error occurred during registration', 'error');
        console.error('Registration error:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Register';
    }
}

/**
 * Handle login form submission
 * @param {Event} e - Form submit event
 */
async function handleLogin(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const formData = getFormData(form);
    
    try {
        // Disable button during submission
        submitBtn.disabled = true;
        submitBtn.textContent = 'Logging in...';
        
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: formData.email.trim(),
                password: formData.password // Don't trim password
            }),
            credentials: 'include' // Important for cookies
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        // Store authentication data
        storeAuthData(data.token, data.user);
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
        
    } catch (error) {
        showAlert(error.message || 'An error occurred during login', 'error');
        console.error('Login error:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Login';
    }
}

/**
 * Store authentication data in localStorage
 * @param {string} token - JWT token
 * @param {object} user - User data
 */
function storeAuthData(token, user) {
    localStorage.setItem('userToken', token);
    localStorage.setItem('userData', JSON.stringify(user));
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if authenticated
 */
function isAuthenticated() {
    return !!localStorage.getItem('userToken');
}

/**
 * Get current user data
 * @returns {object|null} User data or null if not authenticated
 */
function getCurrentUser() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
}

/**
 * Get JWT token
 * @returns {string|null} Token or null if not authenticated
 */
function getToken() {
    return localStorage.getItem('userToken');
}

/**
 * Logout user
 */
function logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    window.location.href = 'login.html';
}

/**
 * Check authentication state and redirect if needed
 */
function checkAuthState() {
    const authPages = ['login.html', 'register.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (authPages.includes(currentPage)) {
        if (isAuthenticated()) {
            window.location.href = 'dashboard.html';
        }
    } else {
        if (!isAuthenticated()) {
            window.location.href = 'login.html';
        }
    }
}

/**
 * Get form data as object
 * @param {HTMLFormElement} form 
 * @returns {object} Form data
 */
function getFormData(form) {
    const formData = {};
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        if (input.name) {
            formData[input.name] = input.value;
        }
    });
    
    return formData;
}

/**
 * Show alert message
 * @param {string} message - Message to display
 * @param {string} type - Type of alert (success, error, warning)
 */
function showAlert(message, type = 'error') {
    // Remove any existing alerts first
    const existingAlert = document.querySelector('.auth-alert');
    if (existingAlert) existingAlert.remove();
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `auth-alert alert-${type}`;
    alertDiv.textContent = message;
    
    // Add to DOM - adjust selector based on your HTML structure
    const authContainer = document.querySelector('.auth-container');
    if (authContainer) {
        authContainer.prepend(alertDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    } else {
        console.error('Could not find auth container for alert');
    }
}

// Make functions available globally if needed
window.auth = {
    isAuthenticated,
    getCurrentUser,
    getToken,
    logout,
    showAlert
};