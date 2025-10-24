// Function to track CTA clicks in Google Analytics
function trackCtaClick(label) {
    if (typeof gtag === 'function') {
        gtag('event', 'click', {
            'event_category': 'CTA',
            'event_label': label,
        });
    }
}
// Make it globally accessible
window.trackCtaClick = trackCtaClick;


document.addEventListener('DOMContentLoaded', () => {

    // --- Hero Text Animation ---
    const wordsContainer = document.querySelector('.animated-text-wrapper .word-underline');
    if (wordsContainer) {
        const words = wordsContainer.querySelectorAll('.animated-word');
        let currentIndex = 0;
        
        if (words.length > 0) {
            // Set the first word as active initially
            words[currentIndex].classList.add('active');
        
            setInterval(() => {
                const currentWord = words[currentIndex];
                const nextIndex = (currentIndex + 1) % words.length;
                const nextWord = words[nextIndex];
                
                // Animate out the current word
                currentWord.classList.add('leaving');
                currentWord.classList.remove('active');
                
                // Animate in the next word
                nextWord.classList.remove('leaving'); // Just in case
                nextWord.classList.add('active');
                
                // Reset the 'leaving' state after the animation finishes
                setTimeout(() => {
                    currentWord.classList.remove('leaving');
                }, 700); // Should be slightly longer than the CSS transition
                
                currentIndex = nextIndex;
            }, 3000); // Change word every 3 seconds
        }
    }

    // --- Greeting Bubble ---
    const greetingBubble = document.getElementById('greeting-bubble');
    if (greetingBubble) {
        const hour = new Date().getHours();
        let greeting;
        if (hour >= 1 && hour < 12) {
            greeting = 'Good Morning!';
        } else if (hour < 16) {
            greeting = 'Good Afternoon!';
        } else {
            greeting = 'Good Evening!';
        }
        greetingBubble.textContent = `Hello, ${greeting}`;
    }

    // --- Dark/Light Theme Switcher ---
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const htmlEl = document.documentElement;

    const setTheme = (theme) => {
        if (theme === 'dark') {
            htmlEl.classList.add('dark-theme');
        } else {
            htmlEl.classList.remove('dark-theme');
        }
        localStorage.setItem('theme', theme);
    };

    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        setTheme(savedTheme);
    } else { // Default to time-based theme if no choice is saved
        const hour = new Date().getHours();
        // After 6 PM or before 6 AM is considered night
        if (hour >= 18 || hour < 6) {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    }

    themeToggleBtn.addEventListener('click', () => {
        if (htmlEl.classList.contains('dark-theme')) {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    });

    // --- Header scroll effect & Floating Buttons ---
    const header = document.querySelector('.header');
    const floatingCta = document.querySelector('.floating-cta');
    const scrollToTopBtn = document.getElementById('scroll-to-top-btn');
    const heroSection = document.querySelector('#hero');

    window.addEventListener('scroll', () => {
        // Header scroll effect
        header.classList.toggle('scrolled', window.scrollY > 50);

        // Floating buttons logic
        const isNearBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 150;
        const isPastHero = heroSection ? window.scrollY > heroSection.offsetHeight / 2 : window.scrollY > 300;

        if (isNearBottom) {
            floatingCta.classList.remove('visible');
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
            floatingCta.classList.toggle('visible', isPastHero);
        }
    });
    
    // Scroll to top button click event
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }


    // --- Hamburger menu toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navItems = document.querySelectorAll('.nav-item');

    const toggleMenu = () => {
        const isActive = navMenu.classList.contains('active');
        hamburger.classList.toggle('active', !isActive);
        navMenu.classList.toggle('active', !isActive);
        document.body.style.overflow = isActive ? '' : 'hidden';
        
        if (!isActive) {
            navItems.forEach((item, index) => {
                item.style.transition = 'none';
                item.style.opacity = '0';
                setTimeout(() => {
                    item.style.transition = `opacity 0.4s ease-in-out ${index * 0.08 + 0.3}s`;
                    item.style.opacity = '1';
                }, 10);
            });
        } else {
             navItems.forEach(item => {
                item.style.transition = 'opacity 0.2s ease-in-out';
                item.style.opacity = '0';
             });
        }
    };

    hamburger.addEventListener('click', toggleMenu);
    
    document.querySelectorAll('.nav-menu a, .logo').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // --- Scroll-triggered animations ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    animatedElements.forEach(el => observer.observe(el));

    // --- Interactive 'Why Us' Section ---
    const featuresSection = document.querySelector('#why-us');
    if (featuresSection) {
        const featureItems = featuresSection.querySelectorAll('.feature-item');
        const imageWrapper = featuresSection.querySelector('.feature-image-wrapper');
        const featureImages = [
            'assets/images/personalised-mentorship.png',
            'assets/images/passionate-educator.png',
            'assets/images/deep-conceptual-quality.png',
        ];
        
        featureImages.forEach(src => { (new Image()).src = src; });
        
        featureImages.forEach((src, index) => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = `Feature image ${index + 1}`;
            img.classList.add('feature-image');
            img.style.opacity = (index === 0) ? '1' : '0';
            imageWrapper.appendChild(img);
        });

        let currentFeatureIndex = 0;
        let featureInterval;

        const setActiveFeature = (index) => {
            if (index === currentFeatureIndex && featureInterval) return;
            featureItems.forEach((item, i) => item.classList.toggle('active', i === index));
            imageWrapper.querySelectorAll('.feature-image').forEach((img, i) => { img.style.opacity = (i === index) ? '1' : '0'; });
            currentFeatureIndex = index;
        };

        const startFeatureRotation = () => {
            featureInterval = setInterval(() => {
                const nextIndex = (currentFeatureIndex + 1) % featureItems.length;
                setActiveFeature(nextIndex);
            }, 4000);
        };
        
        const stopFeatureRotation = () => {
            clearInterval(featureInterval);
            featureInterval = null;
        };

        featureItems.forEach((item, index) => {
            item.addEventListener('mouseenter', () => {
                stopFeatureRotation();
                setActiveFeature(index);
            });
        });

        featuresSection.addEventListener('mouseleave', () => {
            if (!featureInterval) startFeatureRotation();
        });

        startFeatureRotation();
    }
    
    // --- Testimonial Slider ---
    const sliderContainer = document.querySelector('.testimonial-slider-container');
    if(sliderContainer) {
        const wrapper = sliderContainer.querySelector('.testimonial-wrapper');
        const slides = Array.from(sliderContainer.querySelectorAll('.testimonial-slide'));
        const prevBtn = sliderContainer.querySelector('.prev-btn');
        const nextBtn = sliderContainer.querySelector('.next-btn');
        const indicatorsContainer = sliderContainer.querySelector('.slider-indicators');
        let currentIndex = 0;
        
        const getVisibleSlides = () => window.innerWidth <= 768 ? 1 : (window.innerWidth <= 992 ? 2 : 3);
        const totalSlides = slides.length;

        const createIndicators = () => {
            indicatorsContainer.innerHTML = '';
            const visibleSlides = getVisibleSlides();
            const numPages = totalSlides - visibleSlides + 1;
            if (numPages <= 1) return;

            for (let i = 0; i < numPages; i++) {
                const dot = document.createElement('button');
                dot.classList.add('indicator-dot');
                dot.setAttribute('aria-label', `Go to slide page ${i + 1}`);
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateSlider();
                });
                indicatorsContainer.appendChild(dot);
            }
        };

        const updateSlider = (isResize = false) => {
            const visibleSlides = getVisibleSlides();
            const maxIndex = totalSlides - visibleSlides;
            
            if (isResize && currentIndex > maxIndex) {
                currentIndex = maxIndex;
            }
            
            const slideWidth = slides.length > 0 ? slides[0].offsetWidth : 0;
            const gap = parseInt(window.getComputedStyle(wrapper).gap) || 30;
            const totalWidthPerSlide = slideWidth + gap;
            
            wrapper.style.transform = `translateX(-${currentIndex * totalWidthPerSlide}px)`;
            
            // Update indicators
            const dots = indicatorsContainer.querySelectorAll('.indicator-dot');
            if (dots.length > 0) {
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentIndex);
                });
            }
        };

        const handleNext = () => {
            const visibleSlides = getVisibleSlides();
            const maxIndex = totalSlides - visibleSlides;
            currentIndex = (currentIndex + 1 > maxIndex) ? 0 : currentIndex + 1;
            updateSlider();
        };

        const handlePrev = () => {
            const visibleSlides = getVisibleSlides();
            const maxIndex = totalSlides - visibleSlides;
            currentIndex = (currentIndex - 1 < 0) ? maxIndex : currentIndex - 1;
            updateSlider();
        };

        nextBtn.addEventListener('click', handleNext);
        prevBtn.addEventListener('click', handlePrev);

        // Touch/Swipe functionality
        let touchStartX = 0;
        let touchEndX = 0;

        const handleSwipe = () => {
            if (touchEndX < touchStartX - 50) handleNext(); // Swiped left
            if (touchEndX > touchStartX + 50) handlePrev(); // Swiped right
        };

        wrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        wrapper.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        window.addEventListener('resize', () => {
            createIndicators();
            updateSlider(true);
        });

        createIndicators();
        updateSlider();
    }

    // --- Video Modal ---
    const videoModal = document.getElementById('video-modal');
    if (videoModal) {
        const openTriggers = document.querySelectorAll('.video-placeholder');
        const closeModalBtn = document.querySelector('.close-modal-btn');
        const videoPlayerContainer = document.getElementById('video-player-container');

        const openModal = (youtubeId) => {
            videoPlayerContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            videoModal.classList.add('open');
            document.body.classList.add('modal-open');
        };

        const closeModal = () => {
            videoModal.classList.remove('open');
            document.body.classList.remove('modal-open');
            videoPlayerContainer.innerHTML = ''; // Stop the video
        };

        openTriggers.forEach(trigger => {
            const youtubeId = trigger.parentElement.dataset.youtubeId;
            if (youtubeId) {
                trigger.addEventListener('click', () => openModal(youtubeId));
            } else {
                const playButton = trigger.querySelector('.play-button');
                if (playButton) playButton.style.display = 'none';
            }
        });
        
        closeModalBtn.addEventListener('click', closeModal);
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) closeModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === "Escape" && videoModal.classList.contains('open')) closeModal();
        });
    }

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const wasActive = item.classList.contains('active');
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            });
            if (!wasActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // --- Footer Year ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

});
