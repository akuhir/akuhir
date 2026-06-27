// Authentication Module
class Auth {
    constructor() {
        this.users = [
            { matric: 'AKU24/FE/HIS/1002', name: 'Student 1002', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1003', name: 'Student 1003', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1004', name: 'Student 1004', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1005', name: 'Student 1005', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1006', name: 'Student 1006', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1007', name: 'Student 1007', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1008', name: 'Student 1008', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1009', name: 'Student 1009', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1010', name: 'Student 1010', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1011', name: 'Student 1011', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1012', name: 'Student 1012', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1013', name: 'Student 1013', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1014', name: 'Student 1014', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1015', name: 'Student 1015', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1016', name: 'Student 1016', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1017', name: 'Student 1017', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1018', name: 'Student 1018', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1019', name: 'Student 1019', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1020', name: 'Student 1020', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1021', name: 'Student 1021', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1022', name: 'Student 1022', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1023', name: 'Student 1023', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1024', name: 'Student 1024', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1025', name: 'Student 1025', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1026', name: 'Student 1026', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1027', name: 'Student 1027', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1028', name: 'Student 1028', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1029', name: 'Student 1029', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1030', name: 'Student 1030', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1031', name: 'Student 1031', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1032', name: 'Student 1032', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1033', name: 'Student 1033', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1034', name: 'Student 1034', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1035', name: 'Student 1035', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1036', name: 'Student 1036', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1037', name: 'Student 1037', password: 'password123' },
            { matric: 'AKU25/FEDU/HIS/2001', name: 'Student 2001', password: 'password123' },
            { matric: 'AKU25/FEDU/HIS/2002', name: 'Student 2002', password: 'password123' },
        ];
        
        this.currentUser = localStorage.getItem('currentUser');
        this.initializeLoginPage();
    }

    initializeLoginPage() {
        // Redirect to home if already logged in
        if (this.currentUser && !window.location.pathname.includes('index.html')) {
            window.location.href = 'index.html';
        }

        // Check if we're on the login page
        if (document.getElementById('loginForm')) {
            this.setupLoginForm();
            this.setupThemeToggle();
        }
    }

    setupLoginForm() {
        const form = document.getElementById('loginForm');
        const matricInput = document.getElementById('matricNumber');
        const rememberCheckbox = document.getElementById('rememberMe');

        // Matric number formatting
        matricInput.addEventListener('input', (e) => {
            let value = e.target.value.toUpperCase();
            e.target.value = value;
        });

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const rememberMe = rememberCheckbox.checked;
            this.login(matricInput.value, rememberMe);
        });
    }

    login(matric, rememberMe = false) {
        // Clear previous errors
        this.clearErrors();

        // Validate inputs
        if (!matric.trim()) {
            this.showError('matricError', 'Please enter your matric number');
            return;
        }

        // Check credentials (matric number only)
        const user = this.users.find(u => u.matric === matric);

        if (user) {
            // Login successful
            localStorage.setItem('currentUser', matric);
            localStorage.setItem('currentUserName', user.name);
            
            // Remember me for 30 days
            if (rememberMe) {
                const expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + 30);
                localStorage.setItem('loginExpiry', expiryDate.getTime());
            } else {
                localStorage.removeItem('loginExpiry');
            }
            
            this.showSuccessAnimation();
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 500);
        } else {
            // Login failed
            this.showError('matricError', 'Invalid matric number. Please check and try again.');
        }
    }

    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    clearErrors() {
        const errors = document.querySelectorAll('.error-message');
        errors.forEach(error => {
            error.textContent = '';
            error.classList.remove('show');
        });
    }

    showSuccessAnimation() {
        const loginCard = document.querySelector('.login-card');
        loginCard.style.opacity = '0.8';
        loginCard.style.transform = 'scale(0.98)';
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggleLogin');
        const savedTheme = localStorage.getItem('theme');

        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.textContent = '☀️';
        }

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            themeToggle.textContent = isDark ? '☀️' : '🌙';
        });
    }

    logout() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentUserName');
        window.location.href = 'login.html';
    }

    getCurrentUser() {
        return localStorage.getItem('currentUser');
    }

    isLoggedIn() {
        return !!localStorage.getItem('currentUser');
    }
}

// Initialize Auth on page load
document.addEventListener('DOMContentLoaded', () => {
    window.auth = new Auth();
});
