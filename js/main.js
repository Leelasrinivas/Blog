// Main JavaScript functionality for Leela Srinivas Portfolio
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all components
    initializeNavigation();
    initializeAnimations();
    initializeCounters();
    initializeSkillBars();
    // Delay matrix rain for better performance
    setTimeout(() => initializeMatrixRain(), 1000);
    initializeContactForm();
    initializeTypingEffects();
    initializeScrollIndicator();
    initializeLoadingScreen();
    // Delay particles for better performance
    setTimeout(() => initializeParticles(), 500);
    
    // Smooth scrolling for navigation links
    function initializeNavigation() {
        const navbar = document.getElementById('navbar');
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');
        
        // Mobile menu toggle
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Navbar scroll effect
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
        
        // Active section highlighting
        const sections = document.querySelectorAll('section[id]');
        
        function highlightActiveSection() {
            const scrollPosition = window.scrollY + 200;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                const navLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    if (navLink) navLink.classList.add('active');
                }
            });
        }
        
        window.addEventListener('scroll', highlightActiveSection);
        
        // Smooth scroll for anchor links
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Initialize AOS (Animate On Scroll) and custom animations
    function initializeAnimations() {
        // Initialize AOS
        AOS.init({
            duration: 800,
            easing: 'ease-out',
            once: true,
            offset: 100
        });
        
        // Custom scroll animations
        const animateElements = document.querySelectorAll('.animate-on-scroll');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animateElements.forEach(element => {
            observer.observe(element);
        });
        
        // Parallax effect for hero section
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax');
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
    
    // Counter animations for statistics
    function initializeCounters() {
        const counters = document.querySelectorAll('.stat-number[data-count]');
        const speed = 200; // Lower is faster
        
        const countUp = (counter) => {
            const target = parseInt(counter.dataset.count);
            const count = parseInt(counter.innerText);
            const increment = target / speed;
            
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(() => countUp(counter), 1);
            } else {
                counter.innerText = target + (target === 500 ? '+' : '');
            }
        };
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    if (!counter.classList.contains('counted')) {
                        counter.classList.add('counted');
                        setTimeout(() => countUp(counter), 500);
                    }
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
    
    // Skill bar animations
    function initializeSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress[data-width]');
        
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillBar = entry.target;
                    const width = skillBar.dataset.width;
                    setTimeout(() => {
                        skillBar.style.width = width;
                    }, 200);
                }
            });
        }, { threshold: 0.5 });
        
        skillBars.forEach(skillBar => {
            skillObserver.observe(skillBar);
        });
    }
    
    // Matrix rain effect
    function initializeMatrixRain() {
        const canvas = document.getElementById('matrix-rain');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Matrix characters
        const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
        const matrixArray = matrix.split("");
        
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = [];
        
        // Initialize drops
        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }
        
        function draw() {
            // Black background with opacity for trail effect
            ctx.fillStyle = 'rgba(32, 39, 51, 0.08)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Cyan text with lower opacity
            ctx.fillStyle = 'rgba(0, 255, 255, 0.6)';
            ctx.font = fontSize + 'px monospace';
            
            // Reduce columns for better performance
            const activeColumns = Math.min(columns, window.innerWidth <= 768 ? 30 : 60);
            
            for (let i = 0; i < activeColumns; i++) {
                const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.98) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }
        
        // Slower animation for better performance
        setInterval(draw, window.innerWidth <= 768 ? 60 : 45);
    }
    
    // Contact form handling
    function initializeContactForm() {
        const contactForm = document.getElementById('contact-form');
        
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formData = new FormData(contactForm);
                const submitBtn = contactForm.querySelector('.btn-submit');
                const originalText = submitBtn.innerHTML;
                
                // Show loading state
                submitBtn.innerHTML = '<span>Sending...</span><div class="loading-spinner"></div>';
                submitBtn.disabled = true;
                
                // Simulate form submission (replace with actual endpoint)
                setTimeout(() => {
                    // Success state
                    submitBtn.innerHTML = '<span>Message Sent!</span><div class="success-checkmark"></div>';
                    submitBtn.style.background = 'var(--gradient-accent)';
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Reset button after 3 seconds
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.background = '';
                    }, 3000);
                    
                    // Show success notification
                    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                }, 2000);
            });
            
            // Form validation
            const inputs = contactForm.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', validateField);
                input.addEventListener('input', clearFieldError);
            });
        }
        
        function validateField(e) {
            const field = e.target;
            const value = field.value.trim();
            
            // Remove existing error
            clearFieldError(e);
            
            // Validation rules
            if (field.hasAttribute('required') && !value) {
                showFieldError(field, 'This field is required');
                return false;
            }
            
            if (field.type === 'email' && value) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(value)) {
                    showFieldError(field, 'Please enter a valid email address');
                    return false;
                }
            }
            
            return true;
        }
        
        function showFieldError(field, message) {
            field.style.borderColor = 'var(--color-cyber-red)';
            
            let errorElement = field.parentNode.querySelector('.field-error');
            if (!errorElement) {
                errorElement = document.createElement('span');
                errorElement.className = 'field-error';
                errorElement.style.color = 'var(--color-cyber-red)';
                errorElement.style.fontSize = '0.85rem';
                errorElement.style.marginTop = '0.25rem';
                errorElement.style.display = 'block';
                field.parentNode.appendChild(errorElement);
            }
            errorElement.textContent = message;
        }
        
        function clearFieldError(e) {
            const field = e.target;
            field.style.borderColor = '';
            
            const errorElement = field.parentNode.querySelector('.field-error');
            if (errorElement) {
                errorElement.remove();
            }
        }
    }
    
    // Typing effects
    function initializeTypingEffects() {
        const typingElements = document.querySelectorAll('.typing-effect[data-text]');
        
        typingElements.forEach((element, index) => {
            const text = element.dataset.text;
            const delay = parseInt(element.dataset.delay) || index * 1000;
            const speed = parseInt(element.dataset.speed) || 50;
            
            setTimeout(() => {
                typeText(element, text, speed);
            }, delay);
        });
        
        function typeText(element, text, speed) {
            let i = 0;
            element.textContent = '';
            
            function type() {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                }
            }
            
            type();
        }
    }
    
    // Scroll indicator
    function initializeScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', function() {
                const aboutSection = document.getElementById('about');
                if (aboutSection) {
                    aboutSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
            
            // Hide scroll indicator when scrolled
            window.addEventListener('scroll', function() {
                if (window.scrollY > 200) {
                    scrollIndicator.style.opacity = '0';
                } else {
                    scrollIndicator.style.opacity = '1';
                }
            });
        }
    }
    
    // Loading screen
    function initializeLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        
        // Hide loading screen after page load
        window.addEventListener('load', function() {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                
                // Remove from DOM after transition
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 1500);
        });
    }
    
    // Initialize particles
    function initializeParticles() {
        if (typeof particlesJS !== 'undefined') {
            // Particles configuration is in particles.js
            particlesJS.load('particles-js', 'js/particles.json', function() {
                console.log('Particles loaded');
            });
        }
    }
    
    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-bg-tertiary);
            border: 1px solid var(--color-cyber-cyan);
            border-radius: var(--border-radius-md);
            padding: var(--spacing-md);
            color: var(--color-text-primary);
            font-family: var(--font-secondary);
            box-shadow: var(--shadow-glow);
            z-index: 10000;
            max-width: 400px;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        if (type === 'success') {
            notification.style.borderColor = 'var(--color-cyber-green)';
        } else if (type === 'error') {
            notification.style.borderColor = 'var(--color-cyber-red)';
        }
        
        document.body.appendChild(notification);
        
        // Show notification
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        });
        
        // Close functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', closeNotification);
        
        function closeNotification() {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
        
        // Auto close after 5 seconds
        setTimeout(closeNotification, 5000);
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Konami code easter egg
        const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
        if (!window.konamiProgress) window.konamiProgress = 0;
        
        if (e.keyCode === konamiCode[window.konamiProgress]) {
            window.konamiProgress++;
            if (window.konamiProgress === konamiCode.length) {
                activateEasterEgg();
                window.konamiProgress = 0;
            }
        } else {
            window.konamiProgress = 0;
        }
        
        // Quick navigation shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
                    break;
                case '2':
                    e.preventDefault();
                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                    break;
                case '3':
                    e.preventDefault();
                    document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
                    break;
                case '4':
                    e.preventDefault();
                    document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
                    break;
                case '5':
                    e.preventDefault();
                    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                    break;
            }
        }
    });
    
    // Easter egg activation
    function activateEasterEgg() {
        const body = document.body;
        body.style.filter = 'hue-rotate(180deg)';
        
        showNotification('🎉 Cybersecurity Mode Activated! All systems secured!', 'success');
        
        // Create matrix effect overlay
        const matrixOverlay = document.createElement('div');
        matrixOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 255, 0, 0.1);
            pointer-events: none;
            z-index: 9999;
            animation: pulse 0.5s ease-in-out 3;
        `;
        
        document.body.appendChild(matrixOverlay);
        
        // Reset after 3 seconds
        setTimeout(() => {
            body.style.filter = '';
            if (matrixOverlay.parentNode) {
                matrixOverlay.parentNode.removeChild(matrixOverlay);
            }
        }, 3000);
    }
    
    // Performance optimization: Debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Apply debouncing to scroll events
    window.addEventListener('scroll', debounce(function() {
        // Scroll-dependent functionality here
    }, 10));
    
    // Lazy loading for images
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // Theme toggle (bonus feature)
    function initializeThemeToggle() {
        const themeToggle = document.createElement('button');
        themeToggle.innerHTML = '🌙';
        themeToggle.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: 2px solid var(--color-cyber-cyan);
            background: var(--color-bg-tertiary);
            color: var(--color-cyber-cyan);
            font-size: 20px;
            cursor: pointer;
            z-index: 1000;
            transition: all 0.3s ease;
            display: none; /* Hidden by default */
        `;
        
        document.body.appendChild(themeToggle);
        
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('light-theme');
            themeToggle.innerHTML = document.body.classList.contains('light-theme') ? '☀️' : '🌙';
        });
    }
    
    // Initialize theme toggle
    initializeThemeToggle();
    
    // Console message for developers
    console.log(`
    ╔══════════════════════════════════════════╗
    ║          LEELA SRINIVAS PORTFOLIO        ║
    ║          Cybersecurity Expert            ║
    ╠══════════════════════════════════════════╣
    ║ 🔒 Security Level: Maximum               ║
    ║ 🛡️  Penetration Testing: Active          ║
    ║ 🕵️  Digital Forensics: Enabled           ║
    ║ ⚡ Performance: Optimized               ║
    ╚══════════════════════════════════════════╝
    
    Hire me for your cybersecurity needs!
    📧 leelasrinivasatla@gmail.com
    📞 +91-9885787799
    `);
});

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Export functions for external use
window.LeelaPortfolio = {
    showNotification: function(message, type) {
        // This function is available globally
    },
    scrollToSection: function(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }
};
