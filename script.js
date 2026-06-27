// ========== SUPABASE CHAT CONFIG ==========
const SUPABASE_URL = 'https://aahazlulwpcorwpvqdab.supabase.co';
const SUPABASE_KEY = 'sb_publishable_FH8OyPqmcNddSZ5RiM-9Yw_piCqaZHq';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Student data for name lookup
const studentData = {
    'AKU24/FE/HIS/1002': 'Ameena Mahmood Umar',
    'AKU24/FE/HIS/1003': 'Firdausi Yusuf',
    'AKU24/FE/HIS/1004': 'Aminu Anita Adamu',
    'AKU24/FE/HIS/1005': 'Muhammad Bilkisu Awwal',
    'AKU24/FE/HIS/1006': 'Chinedu Kamara Fortune',
    'AKU24/FE/HIS/1007': 'Sani Blessing',
    'AKU24/FE/HIS/1008': 'Hassan Ahmad',
    'AKU24/FE/HIS/1009': 'Ahmed Nma Muhammed',
    'AKU24/FE/HIS/1010': 'Sumayya Muhammad Sa\'idu',
    'AKU24/FE/HIS/1011': 'Okishang Maria Iripia',
    'AKU24/FE/HIS/1012': 'Salim Yunusa',
    'AKU24/FE/HIS/1013': 'Abduljalal Kabir',
    'AKU24/FE/HIS/1014': 'Rashida Musa',
    'AKU24/FE/HIS/1015': 'Faridat M. Ibrahim',
    'AKU24/FE/HIS/1016': 'Aisha Ibrahim',
    'AKU24/FE/HIS/1017': 'Musa Sadiq Ambursa',
    'AKU24/FE/HIS/1018': 'Tanko Shekwonuzayi Glory',
    'AKU24/FE/HIS/1019': 'Yusuf Hauwa',
    'AKU24/FE/HIS/1020': 'Maryam Umar Wushishi',
    'AKU24/FE/HIS/1021': 'Abdullahi Suleiman',
    'AKU24/FE/HIS/1022': 'Usman Shehu Wada',
    'AKU24/FE/HIS/1023': 'Nwakacha Ifeoma Angela',
    'AKU24/FE/HIS/1024': 'Ahmed Nurudeen Muhammed',
    'AKU24/FE/HIS/1025': 'Ugochukwu Victory Chukma',
    'AKU24/FE/HIS/1026': 'Suraiya Adamu',
    'AKU24/FE/HIS/1027': 'Sule Dorathy',
    'AKU24/FE/HIS/1028': 'Sesugh Vadoo Lovely',
    'AKU24/FE/HIS/1029': 'Sesugh Nadoo Precious',
    'AKU24/FE/HIS/1030': 'Abubakar Lawal Aliyu',
    'AKU24/FE/HIS/1031': 'Yusuf Tasiu',
    'AKU24/FE/HIS/1032': 'Amina Bala Muhammad',
    'AKU24/FE/HIS/1033': 'Amina Shuaibu Wachiko',
    'AKU24/FE/HIS/1034': 'Muhammad Nurudeen Abubakar',
    'AKU24/FE/HIS/1035': 'Amodu Blessing Ojochenemi',
    'AKU24/FE/HIS/1036': 'Ajibade Ayobami Deborah',
    'AKU24/FE/HIS/1037': 'Precious Boluwatife Badmus',
    'AKU25/FEDU/HIS/2001': 'Evelyn Joshua Malgwi',
    'AKU25/FEDU/HIS/2002': 'Usman Bello'
};

class ChatRoom {
    constructor(currentUser) {
        this.currentUser = currentUser;
        this.chatContainer = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.initChat();
    }

    initChat() {
        if (!this.chatContainer || !this.messageInput || !this.sendBtn) return;

        this.loadMessages();
        this.setupRealtimeListener();

        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }

    async loadMessages() {
        try {
            const { data, error } = await supabase
                .from('chat_messages')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) throw error;

            if (this.chatContainer) {
                this.chatContainer.innerHTML = '';
                data.forEach(msg => this.displayMessage(msg));
                this.scrollToBottom();
            }
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;

        const studentName = studentData[this.currentUser] || this.currentUser;

        try {
            const { error } = await supabase
                .from('chat_messages')
                .insert({
                    student_name: studentName,
                    matric_number: this.currentUser,
                    message: message,
                    avatar_initials: this.getInitials(studentName)
                });

            if (error) throw error;

            this.messageInput.value = '';
        } catch (error) {
            console.error('Error sending message:', error);
        }
    }

    displayMessage(msg) {
        const messageEl = document.createElement('div');
        messageEl.className = 'chat-message';

        const timestamp = new Date(msg.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });

        messageEl.innerHTML = `
            <div class="chat-avatar">👤</div>
            <div class="chat-content">
                <div class="chat-name">${msg.student_name}</div>
                <div class="chat-text">${this.escapeHtml(msg.message)}</div>
                <div class="chat-time">${timestamp}</div>
            </div>
        `;

        this.chatContainer.appendChild(messageEl);
    }

    setupRealtimeListener() {
        try {
            supabase
                .channel('chat_messages')
                .on('postgres_changes', {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'chat_messages'
                }, (payload) => {
                    this.displayMessage(payload.new);
                    this.scrollToBottom();
                })
                .subscribe();
        } catch (error) {
            console.error('Error setting up realtime listener:', error);
        }
    }

    scrollToBottom() {
        if (this.chatContainer) {
            this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
        }
    }

    getInitials(name) {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Portal Main Script
class ClassPortal {
    constructor() {
        this.currentUser = localStorage.getItem('currentUser');
        this.currentSection = 'home';
        this.initializePortal();
    }

    initializePortal() {
        // Check authentication
        if (!this.currentUser) {
            window.location.href = 'login.html';
            return;
        }

        // Initialize theme
        this.initializeTheme();

        // Setup navigation
        this.setupNavigation();

        // Setup logout
        this.setupLogout();

        // Display user info
        this.displayUserInfo();

        // Setup event listeners
        this.setupEventListeners();

        // Load home section by default
        this.loadSection('home');
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            this.updateThemeButton();
        }

        const themeToggle = document.getElementById('themeToggle');
        themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        this.updateThemeButton();
    }

    updateThemeButton() {
        const themeToggle = document.getElementById('themeToggle');
        const isDark = document.body.classList.contains('dark-mode');
        themeToggle.textContent = isDark ? '☀️' : '🌙';
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const hamburgerMenu = document.getElementById('hamburgerMenu');
        const sideNavbar = document.getElementById('sideNavbar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        
        // Hamburger menu toggle
        if (hamburgerMenu) {
            hamburgerMenu.addEventListener('click', () => {
                sideNavbar.classList.toggle('open');
                if (sidebarOverlay) {
                    sidebarOverlay.classList.toggle('visible');
                }
            });
        }
        
        // Close menu when overlay is clicked
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', () => {
                sideNavbar.classList.remove('open');
                sidebarOverlay.classList.remove('visible');
            });
        }
        
        // Close menu when link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                if (sideNavbar) {
                    sideNavbar.classList.remove('open');
                }
                if (sidebarOverlay) {
                    sidebarOverlay.classList.remove('visible');
                }
                const section = link.getAttribute('data-section');
                this.loadSection(section);
            });
        });
    }

    loadSection(sectionId) {
        // Hide all sections
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Show selected section
        const selectedSection = document.getElementById(sectionId);
        if (selectedSection) {
            selectedSection.classList.add('active');
        }

        // Update nav active state
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === sectionId) {
                link.classList.add('active');
            }
        });

        // Update current section
        this.currentSection = sectionId;

        // Initialize chat room if switching to chat-room section
        if (sectionId === 'chat-room') {
            setTimeout(() => {
                new ChatRoom(this.currentUser);
            }, 100);
        }

        // Animate entrance
        this.animateSection(selectedSection);
    }

    animateSection(section) {
        if (section) {
            section.style.animation = 'none';
            setTimeout(() => {
                section.style.animation = '';
            }, 10);
        }
    }

    setupLogout() {
        const logoutBtn = document.getElementById('logoutBtn');
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('currentUser');
                window.location.href = 'login.html';
            }
        });
    }

    displayUserInfo() {
        const userDisplay = document.getElementById('userDisplay');
        if (userDisplay) {
            const studentName = studentData[this.currentUser] || this.currentUser;
            userDisplay.textContent = studentName;
        }
    }

    setupEventListeners() {
        // Handle assignment card clicks
        const assignmentCards = document.querySelectorAll('.assignment-card');
        assignmentCards.forEach(card => {
            const detailsBtn = card.querySelector('.btn-small');
            if (detailsBtn) {
                detailsBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const title = card.querySelector('h3').textContent;
                    this.showAssignmentDetails(title);
                });
            }
        });

        // Handle lecture file links
        const fileLinks = document.querySelectorAll('.file-link');
        fileLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const fileName = link.textContent;
                this.downloadFile(fileName);
            });
        });

        // Handle photo clicks
        const photoItems = document.querySelectorAll('.photo-item');
        photoItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const caption = item.querySelector('p');
                this.viewPhotoLarge(img.src, caption.textContent);
            });
        });

        // Handle video clicks
        const videoItems = document.querySelectorAll('.video-item');
        videoItems.forEach(item => {
            item.addEventListener('click', () => {
                const title = item.querySelector('.video-title').textContent;
                this.playVideo(title);
            });
        });

        // Handle Google Form links
        const formLinks = document.querySelectorAll('.btn-primary');
        formLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Allow default behavior - opens Google Form in new tab
                e.target.setAttribute('target', '_blank');
            });
        });
    }

    showAssignmentDetails(assignmentTitle) {
        const details = {
            'Assignment 4: Data Structures': 'Implement binary search tree operations with insert, delete, and search methods. Submit via the portal.',
            'Assignment 3: Sorting Algorithms': 'Compare different sorting algorithms (bubble, selection, merge, quick). Analyze time and space complexity.',
            'Assignment 2: Linked Lists': 'Implement singly and doubly linked lists with various operations.',
            'Assignment 1: Basics Review': 'Review of basic programming concepts including variables, loops, and functions.'
        };

        const detail = details[assignmentTitle] || 'No additional details available.';
        alert(assignmentTitle + '\n\n' + detail);
    }

    downloadFile(fileName) {
        // Show confirmation for file download
        alert('Downloading: ' + fileName + '\n\nThis would download the file in a real application.');
    }

    viewPhotoLarge(src, caption) {
        // Create modal for large photo view
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            cursor: pointer;
        `;

        const imgContainer = document.createElement('div');
        imgContainer.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            display: flex;
            flex-direction: column;
            align-items: center;
        `;

        const img = document.createElement('img');
        img.src = src;
        img.style.cssText = 'max-width: 100%; max-height: 80vh; border-radius: 10px;';

        const captionEl = document.createElement('p');
        captionEl.textContent = caption;
        captionEl.style.cssText = `
            color: white;
            margin-top: 15px;
            text-align: center;
            font-size: 1.1rem;
        `;

        imgContainer.appendChild(img);
        imgContainer.appendChild(captionEl);
        modal.appendChild(imgContainer);

        // Close modal on click
        modal.addEventListener('click', () => modal.remove());

        document.body.appendChild(modal);
    }

    playVideo(videoTitle) {
        // Show alert for video playback
        alert('Playing: ' + videoTitle + '\n\nThis would open the video player in a real application.');
    }

    // Utility functions
    getReadableDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString('en-US', options);
    }

    formatTime(hours, minutes) {
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }

    // Add new announcement (for admin/update purposes)
    addAnnouncement(title, content) {
        const container = document.querySelector('.announcements-container');
        if (container) {
            const card = document.createElement('div');
            card.className = 'announcement-card';
            card.innerHTML = `
                <div class="announcement-date">Today</div>
                <h3>${this.escapeHtml(title)}</h3>
                <p>${this.escapeHtml(content)}</p>
            `;
            container.insertBefore(card, container.firstChild);
        }
    }

    // Add new assignment (for admin/update purposes)
    addAssignment(title, description, dueDate, status = 'pending') {
        const container = document.querySelector('.assignments-container');
        if (container) {
            const card = document.createElement('div');
            card.className = `assignment-card ${status}`;
            card.innerHTML = `
                <div class="assignment-header">
                    <h3>${this.escapeHtml(title)}</h3>
                    <span class="status ${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</span>
                </div>
                <p>${this.escapeHtml(description)}</p>
                <div class="assignment-meta">
                    <span>Due: ${dueDate}</span>
                </div>
                <a href="#" class="btn-small">View Details</a>
            `;
            container.appendChild(card);
        }
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Get unread announcements count
    getUnreadCount() {
        // This would be fetched from server in a real app
        const cards = document.querySelectorAll('.announcement-card');
        return cards.length;
    }

    // Search functionality
    search(query) {
        console.log('Searching for:', query);
        // Implement search functionality
    }
}

// Initialize portal when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the portal page
    if (document.getElementById('logoutBtn')) {
        window.portal = new ClassPortal();
    }
});

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Alt + L for logout
    if (e.altKey && e.key === 'l') {
        if (window.portal) {
            window.portal.setupLogout();
        }
    }

    // Ctrl/Cmd + K for search (implement later)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Implement search modal
    }

    // Alt + D for dark mode toggle
    if (e.altKey && e.key === 'd') {
        if (window.portal) {
            window.portal.toggleTheme();
        }
    }
});

// Service Worker registration (for offline support in future)
if ('serviceWorker' in navigator) {
    // Uncomment when SW is created
    // navigator.serviceWorker.register('sw.js');
}

// Handle visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Portal hidden');
    } else {
        console.log('Portal visible');
        // Could refresh data here
    }
});

// Handle page unload
window.addEventListener('beforeunload', (e) => {
    // Optional: warn user if they have unsaved changes
});

// Handle window resize for responsive adjustments
window.addEventListener('resize', () => {
    // Could adjust layout on resize
});

// Prevent context menu (optional - can be removed)
// document.addEventListener('contextmenu', (e) => {
//     e.preventDefault();
// });

// Accessibility: Announce section changes to screen readers
function announceSection(sectionName) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.textContent = `Section changed to ${sectionName}`;
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    document.body.appendChild(announcement);
    
    setTimeout(() => announcement.remove(), 1000);
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ClassPortal };
}
