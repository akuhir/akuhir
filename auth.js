// Authentication Module
class Auth {
    constructor() {
        this.users = [
            { matric: 'AKU24/FE/HIS/1002', name: 'Ameena Mahmood Umar', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1003', name: 'Firdausi Yusuf', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1004', name: 'Aminu Anita Adamu', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1005', name: 'Muhammad Bilkisu Awwal', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1006', name: 'Chinedu Kamara Fortune', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1007', name: 'Sani Blessing', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1008', name: 'Hassan Ahmad', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1009', name: 'Ahmed Nma Muhammed', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1010', name: "Sumayya Muhammad Sa'idu", password: 'password123' },
            { matric: 'AKU24/FE/HIS/1011', name: 'Salim Yunusa', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1012', name: 'Okishang Maria Iripia', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1013', name: 'Abduljalal Kabir', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1014', name: 'Rashida Musa', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1015', name: 'Faridat M. Ibrahim', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1016', name: 'Aisha Ibrahim', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1017', name: 'Musa Sadiq Ambursa', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1018', name: 'Tanko Shekwonuzayi Glory', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1019', name: 'Yusuf Hauwa', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1020', name: 'Maryam Umar Wushishi', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1021', name: 'Abdullahi Suleiman', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1022', name: 'Usman Shehu Wada', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1023', name: 'Nwakacha Ifeoma Angela', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1024', name: 'Ahmed Nurudeen Muhammed', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1025', name: 'Ugochukwu Victory Chukma', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1026', name: 'Suraiya Adamu', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1027', name: 'Sule Dorathy', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1028', name: 'Sesugh Vadoo Lovely', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1029', name: 'Sesugh Nadoo Precious', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1030', name: 'Abubakar Lawal Aliyu', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1031', name: 'Yusuf Tasiu', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1032', name: 'Amina Bala Muhammad', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1033', name: 'Amina Shuaibu Wachiko', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1034', name: 'Muhammad Nurudeen Abubakar', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1035', name: 'Amodu Blessing Ojochenemi', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1036', name: 'Ajibade Ayobami Deborah', password: 'password123' },
            { matric: 'AKU24/FE/HIS/1037', name: 'Precious Boluwatife Badmus', password: 'password123' },
            { matric: 'AKU25/FEDU/HIS/2001', name: 'Evelyn Joshua Malgwi', password: 'password123' },
            { matric: 'AKU25/FEDU/HIS/2002', name: 'Usman Bello', password: 'password123' },
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
