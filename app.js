// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initSkillBars();
    initTypingAnimation();
    initSmoothScrolling();
    initProfileImage();
    initContactCards();
    initModals(); // Initialize modal functionality
});

// Profile Image Loading and Error Handling
function initProfileImage() {
    const profileImage = document.querySelector('.profile-image');
    const profileContainer = document.querySelector('.profile-image-container');
    const photoPlaceholder = document.querySelector('.photo-placeholder');
    
    if (profileImage) {
        // Add loading state
        profileContainer.classList.add('loading');
        
        // Handle successful image load
        profileImage.onload = function() {
            profileContainer.classList.remove('loading');
            profileImage.classList.add('loaded');
            profileImage.style.opacity = '1';
            if (photoPlaceholder) {
                photoPlaceholder.style.display = 'none';
            }
        };
        
        // Handle image load error - show placeholder
        profileImage.onerror = function() {
            profileContainer.classList.remove('loading');
            profileImage.style.display = 'none';
            if (photoPlaceholder) {
                photoPlaceholder.style.display = 'flex';
                photoPlaceholder.innerHTML = '<i class="fas fa-user"></i>';
            }
        };
        
        // Check if image is already cached and loaded
        if (profileImage.complete) {
            if (profileImage.naturalWidth > 0) {
                profileImage.onload();
            } else {
                profileImage.onerror();
            }
        }
    }
}

// Navigation Functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navBrand = document.getElementById('nav-brand'); // Get the brand element

    // Sticky navigation on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            if (navBrand) {
                navBrand.classList.add('visible');
            }
        } else {
            navbar.classList.remove('scrolled');
            if (navBrand) {
                navBrand.classList.remove('visible');
            }
        }
    });

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const isExpanded = navMenu.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isExpanded);
            
            // Animate hamburger menu
            const spans = navToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                span.style.transform = isExpanded 
                    ? `rotate(${index === 0 ? '45deg' : index === 1 ? '0deg' : '-45deg'})`
                    : 'rotate(0deg)';
                if (index === 1) {
                    span.style.opacity = isExpanded ? '0' : '1';
                }
            });
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            if (navToggle) {
                navToggle.setAttribute('aria-expanded', 'false');
                const spans = navToggle.querySelectorAll('span');
                spans.forEach((span, index) => {
                    span.style.transform = 'rotate(0deg)';
                    if (index === 1) {
                        span.style.opacity = '1';
                    }
                });
            }
        });
    });

    // Update active nav link based on scroll position
    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Smooth Scrolling - Enhanced version
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            // Don't prevent default for external links or contact links
            const href = this.getAttribute('href');
            if (href === '#' || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) {
                return; // Let browser handle these normally
            }
            
            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without causing page jump
                if (history.pushState) {
                    history.pushState(null, null, href);
                }
            }
        });
    });
}

// Contact Cards Interaction
function initContactCards() {
    const contactCards = document.querySelectorAll('.contact-card');
    
    contactCards.forEach(card => {
        // Add click animation effect
        card.addEventListener('click', function(e) {
            // Only animate if not clicking on a link
            if (!e.target.closest('a')) {
                this.style.transform = 'translateY(-10px) scale(0.98)';
                setTimeout(() => {
                    this.style.transform = 'translateY(-10px) scale(1)';
                }, 150);
            }
        });

        // Enhanced hover effects
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.contact-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });

        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.contact-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });

    // Add click tracking for contact links (for analytics)
    const contactLinks = document.querySelectorAll('.contact-link');
    contactLinks.forEach(link => {
        link.addEventListener('click', function() {
            const linkType = this.textContent.trim();
            console.log(`Contact link clicked: ${linkType}`);
            
            // Add ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%) scale(0);
                background: rgba(80, 200, 120, 0.3);
                border-radius: 50%;
                animation: contactRipple 0.6s ease-out;
                pointer-events: none;
                z-index: 1000;
            `;
            
            this.style.position = 'relative';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all fade-in elements
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

// Skill Bar Animations
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const skillObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.getAttribute('data-width');
                
                setTimeout(() => {
                    progressBar.style.width = width + '%';
                }, 300);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// Enhanced Typing Animation
function initTypingAnimation() {
    const typingText = document.querySelector('.typing-text');
    if (!typingText) return;
    
    const text = typingText.textContent;
    typingText.textContent = '';
    typingText.style.borderRight = '2px solid var(--emerald-green)';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            typingText.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        } else {
            // Blinking cursor animation
            setInterval(() => {
                typingText.style.borderRightColor = 
                    typingText.style.borderRightColor === 'transparent' 
                    ? 'var(--emerald-green)' 
                    : 'transparent';
            }, 500);
        }
    };
    
    // Start typing animation after a delay
    setTimeout(typeWriter, 2000);
}

// Project Modal Functionality
function initModals() {
    const openModalButtons = document.querySelectorAll('[data-modal-target]');
    const closeModalButtons = document.querySelectorAll('.modal-close-btn');
    const overlays = document.querySelectorAll('.modal-overlay');

    openModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = document.querySelector(button.dataset.modalTarget);
            openModal(modal);
        });
    });

    overlays.forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeModal(overlay);
            }
        });
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal-overlay');
            closeModal(modal);
        });
    });

    function openModal(modal) {
        if (modal == null) return;
        modal.classList.add('active');
        document.body.classList.add('modal-active');
    }

    function closeModal(modal) {
        if (modal == null) return;
        modal.classList.remove('active');
        document.body.classList.remove('modal-active');
    }
}


// Enhanced Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Enhanced button click animations
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Skip ripple for navigation buttons
            if (this.getAttribute('href') && this.getAttribute('href').startsWith('#')) {
                return;
            }
            
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Counter animation for stats
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('.stat-number');
                if (statNumber && !statNumber.classList.contains('animated')) {
                    statNumber.classList.add('animated');
                    animateCounter(statNumber);
                }
            }
        });
    }, { threshold: 0.5 });
    
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach(item => {
        statsObserver.observe(item);
    });

    // Enhanced social links animation
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Parallax effect for background circles
    const bgCircles = document.querySelectorAll('.bg-circle');
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        bgCircles.forEach((circle, index) => {
            const speed = (index + 1) * 0.1;
            circle.style.transform = `translateY(${rate * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
    });
});

// Counter animation function
function animateCounter(element) {
    const text = element.textContent;
    const hasPlus = text.includes('+');
    const number = parseInt(text.replace(/[^\d]/g, ''));
    
    if (isNaN(number)) return;
    
    const duration = 2000;
    const steps = 60;
    const stepValue = number / steps;
    const stepDuration = duration / steps;
    
    let currentValue = 0;
    
    const counter = setInterval(() => {
        currentValue += stepValue;
        
        if (currentValue >= number) {
            currentValue = number;
            clearInterval(counter);
        }
        
        element.textContent = Math.floor(currentValue) + (hasPlus ? '+' : '') + (text.includes('2026') ? '' : '');
    }, stepDuration);
}

// Enhanced Card Interactions
function initCardAnimations() {
    const cards = document.querySelectorAll('.skill-category, .cert-card, .interest-card, .timeline-content, .internship-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Initialize card animations
document.addEventListener('DOMContentLoaded', initCardAnimations);

// Add CSS for new animations
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    @keyframes contactRipple {
        to {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-10px); }
    }

    @keyframes slideInUp {
        from { 
            opacity: 0; 
            transform: translateY(30px); 
        }
        to { 
            opacity: 1; 
            transform: translateY(0); 
        }
    }

    .contact-card {
        animation: slideInUp 0.6s ease-out forwards;
    }

    .contact-card:nth-child(1) { animation-delay: 0.1s; }
    .contact-card:nth-child(2) { animation-delay: 0.2s; }
    .contact-card:nth-child(3) { animation-delay: 0.3s; }
`;
document.head.appendChild(style);

// Performance optimization - debounce scroll events
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

// Apply debouncing to scroll-heavy functions
const debouncedScrollHandler = debounce(function() {
    updateActiveNavLink();
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Accessibility improvements
document.addEventListener('keydown', function(e) {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (navToggle) {
                navToggle.setAttribute('aria-expanded', 'false');
                const spans = navToggle.querySelectorAll('span');
                spans.forEach((span, index) => {
                    span.style.transform = 'rotate(0deg)';
                    if (index === 1) {
                        span.style.opacity = '1';
                    }
                });
            }
        }
    }
});

// Hero section enhancements
function initHeroAnimations() {
    const heroContent = document.querySelector('.hero-content');
    const bgCircles = document.querySelectorAll('.bg-circle');
    
    // Add mouse move parallax effect
    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        bgCircles.forEach((circle, index) => {
            const speed = (index + 1) * 0.5;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            
            circle.style.transform += ` translate(${x}px, ${y}px)`;
        });
    });

    // Profile image interaction
    const profileContainer = document.querySelector('.profile-image-container');
    if (profileContainer) {
        profileContainer.addEventListener('click', function() {
            this.style.animation = 'profilePulse 0.6s ease-out';
            setTimeout(() => {
                this.style.animation = 'profilePulse 4s ease-in-out infinite';
            }, 600);
        });
    }
}

// Initialize hero animations
document.addEventListener('DOMContentLoaded', initHeroAnimations);

// Initialize all features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Enhanced Portfolio loaded successfully!');
    
    // Smooth page load animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // Add loading completion indicators
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 1000);
});

// Handle image loading states globally
window.addEventListener('load', function() {
    // All images and resources have loaded
    const profileImage = document.querySelector('.profile-image');
    if (profileImage) {
        profileImage.classList.add('loaded');
    }
    
    // Remove any loading states
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(element => {
        element.classList.remove('loading');
    });

    // Trigger any final animations
    const finalAnimElements = document.querySelectorAll('.contact-card');
    finalAnimElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// Enhanced error handling for images
window.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        console.warn('Image failed to load:', e.target.src);
        
        // If it's the profile image, show fallback
        if (e.target.classList.contains('profile-image')) {
            const photoPlaceholder = document.querySelector('.photo-placeholder');
            const profileContainer = document.querySelector('.profile-image-container');
            
            if (photoPlaceholder) {
                e.target.style.display = 'none';
                photoPlaceholder.style.display = 'flex';
                if (profileContainer) {
                    profileContainer.classList.remove('loading');
                }
            }
        }
    }
}, true);

// Contact link analytics and feedback
function trackContactInteraction(type, value) {
    console.log(`Contact interaction: ${type} - ${value}`);
    
    // Visual feedback for user
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, var(--emerald-green), rgb(60,180,100));
        color: white;
        padding: 12px 20px;
        border-radius: 25px;
        font-weight: 600;
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        box-shadow: 0 10px 25px rgba(80,200,120,0.3);
    `;
    
    notification.textContent = `Opening ${type}...`;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// Add contact tracking to existing contact links
document.addEventListener('DOMContentLoaded', function() {
    const contactLinks = document.querySelectorAll('.contact-link');
    contactLinks.forEach(link => {
        link.addEventListener('click', function() {
            const href = this.getAttribute('href');
            let type = 'Contact';
            
            if (href.includes('mail.google.com')) {
                type = 'Email';
            } else if (href.includes('wa.me')) {
                type = 'WhatsApp';
            } else if (href.includes('maps.google.com')) {
                type = 'Maps';
            }
            
            trackContactInteraction(type, href);
        });
    });
});