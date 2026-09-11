/* ================================================
   CINEMATIC WEDDING WEBSITE - INTERACTIONS
   Bringing the love story to life
   ================================================ */

(function() {
    'use strict';

    // ---- Configuration ----
    const config = {
        scrollThreshold: 100,
        revealThreshold: 0.15,
        parallaxFactor: 0.5,
        animationDuration: 800,
        typewriterSpeed: 35,
        typewriterDelay: 600
    };

    // ---- Elements ----
    const navbar = document.getElementById('navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const navLinks = document.querySelectorAll('.nav-link');
    const heroVideo = document.querySelector('.hero-video');
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-rotate, .reveal-fade, .reveal-blur, .gallery-card, .couple-section-header, .couple-solo--groom, .couple-solo--bride, .couple-connector, .couple-card');
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpSuccess = document.getElementById('rsvpSuccess');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const galleryItems = document.querySelectorAll('.gallery-card');

    // Celebration Elements
    const celebrationCards = document.querySelectorAll('.celebration-card');
    const celebrationStage = document.querySelector('.celebration-stage');

    // Countdown Elements
    const countdownSection = document.getElementById('countdown');
    const countdownContainer = document.querySelector('.countdown-container');
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const particlesContainer = document.getElementById('particles');

    // Journey Carousel Elements
    const journeyVideo = document.querySelector('.chapter-video');
    const playVideoBtn = document.querySelector('.play-video-btn');

    // Music Player Elements
    const musicPlayer = document.getElementById('musicPlayer');
    const musicPlayerBtn = document.getElementById('musicPlayerBtn');
    const musicVisualizer = document.getElementById('musicVisualizer');
    const mpIconPlay = musicPlayerBtn?.querySelector('.mp-icon-play');
    const mpIconPause = musicPlayerBtn?.querySelector('.mp-icon-pause');

    let currentImageIndex = 0;
    let imagesArray = [];
    let previousValues = { days: -1, hours: -1, minutes: -1, seconds: -1 };
    let coupleTypewriterObserver = null;

    // Music Player State
    let audioContext = null;
    let analyser = null;
    let vizAnimationId = null;
    let vizBars = [];
    

    // ---- Navbar Behavior ----
    function handleNavbarScroll() {
        const scrollY = window.scrollY;

        if (scrollY > config.scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // ---- Mobile Menu ----
    function toggleMobileMenu() {
        navToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        const isActive = mobileMenu.classList.contains('active');
        document.body.style.overflow = isActive ? 'hidden' : '';
        document.body.classList.toggle('mobile-menu-open', isActive);
    }

    function closeMobileMenu() {
        navToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
        document.body.classList.remove('mobile-menu-open');
    }

    // ---- Smooth Scroll ----
    function smoothScroll(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }

        closeMobileMenu();
    }

    // ---- Scroll Reveal Animation ----
    function revealOnScroll(entries, observer) {
        entries.forEach(entry => {
            if (!entry || !entry.target) return;
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }

    function setupScrollReveal() {
        const observerOptions = {
            threshold: config.revealThreshold,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(revealOnScroll, observerOptions);
        revealElements.forEach(el => observer.observe(el));
    }

    function initSectionReveal() {
        const sections = document.querySelectorAll('.section-reveal');
        if (!sections.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

        sections.forEach(section => observer.observe(section));
    }

    // ---- Countdown Timer ----
    function updateCountdown() {
        const weddingDate = new Date('October 24, 2026 12:30:00').getTime();
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance <= 0) {
            daysEl.textContent = '000';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Animate changes
        animateValue(daysEl, days, previousValues.days, 'days');
        animateValue(hoursEl, hours, previousValues.hours, 'hours', 2);
        animateValue(minutesEl, minutes, previousValues.minutes, 'minutes', 2);
        animateValue(secondsEl, seconds, previousValues.seconds, 'seconds', 2);

        previousValues = { days, hours, minutes, seconds };
    }

    function animateValue(element, newValue, oldValue, unit, padLength = 3) {
        if (oldValue !== newValue) {
            const formatted = newValue.toString().padStart(padLength, '0');
            element.classList.add('flip');
            element.textContent = formatted;

            setTimeout(() => {
                element.classList.remove('flip');
            }, 300);
        }
    }

    // ---- Particle System ----
    function createParticles(count = 50) {
        if (!particlesContainer) return;

        // Reduce particles on mobile for performance
        const isMobile = window.innerWidth <= 768;
        const particleCount = isMobile ? Math.min(count, 20) : count;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            // Random properties
            const size = Math.random() * 4 + 1;
            const left = Math.random() * 100;
            const delay = Math.random() * 15;
            const duration = Math.random() * 10 + 10;

            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${left}%;
                bottom: -10px;
                animation-delay: ${delay}s;
                animation-duration: ${duration}s;
            `;

            particlesContainer.appendChild(particle);
        }
    }

    // ---- Initialize Countdown ----
    function initCountdown() {
        if (!countdownSection) return;

        // Create particles
        createParticles(60);

        // Start countdown
        updateCountdown();
        setInterval(updateCountdown, 1000);

        // Setup intersection observer for reveal
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    countdownContainer.classList.add('active');
                }
            });
        }, { threshold: 0.3 });

        observer.observe(countdownSection);
    }

    // ---- Parallax Effect ----
    function handleParallax() {
        if (!heroVideo) return;

        const scrolled = window.scrollY;

        if (scrolled < window.innerHeight) {
            const rate = scrolled * config.parallaxFactor;
            heroVideo.style.transform = `translateY(${rate}px) scale(1.1)`;
        }
    }

    let parallaxTicking = false;
    function requestParallaxUpdate() {
        if (!parallaxTicking) {
            parallaxTicking = true;
            requestAnimationFrame(() => {
                handleParallax();
                parallaxTicking = false;
            });
        }
    }

    // ---- Video Fallback ----
    function setupVideoFallback() {
        if (!heroVideo) return;

        heroVideo.addEventListener('error', function() {
            this.style.display = 'none';
            const wrapper = document.querySelector('.hero-video-wrapper');
            if (wrapper) {
                wrapper.style.background = 'linear-gradient(135deg, #8B7355 0%, #D4A574 50%, #9CAF88 100%)';
            }
        });

        // Ensure video plays
        heroVideo.play().catch(() => {
            // Autoplay failed, fallback already handled
        });
    }

    // ---- RSVP Form ----
    function getRSVPMessage() {
        if (!rsvpForm) return '';
        const attendance = (rsvpForm.querySelector('#attendance')?.value || '').trim();
        const name = (rsvpForm.querySelector('#name')?.value || '').trim();
        const phone = (rsvpForm.querySelector('#phone')?.value || '').trim();
        const plusOne = (rsvpForm.querySelector('#plusone')?.value || '').trim();
        const guestName = (rsvpForm.querySelector('#guestname')?.value || '').trim();
        const events = (rsvpForm.querySelector('#events')?.value || '').trim();

        const attendanceText = attendance === 'accept' ? 'Joyfully Accepts' : attendance === 'decline' ? 'Regretfully Declines' : attendance;
        const eventsText = { engagement: 'Engagement only', ceremony: 'Wedding Ceremony only', reception: 'Reception only', both: 'Both Wedding Ceremony and Reception' }[events] || events;

        return `💍 *Edwin & Regina - Wedding RSVP* 💍\n\n` +
            `*Attendance:* ${attendanceText}\n` +
            `*Name:* ${name}\n` +
            `*Phone:* ${phone}\n` +
            `*Plus One:* ${plusOne === 'justme' ? 'Just me' : plusOne === 'meandguest' ? 'Me and my guest' : plusOne}${guestName ? ` (${guestName})` : ''}\n` +
            `*Events Attending:* ${eventsText}`;
    }

    function openModal(selector) {
        const el = document.querySelector(selector);
        if (!el) return;
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
        requestAnimationFrame(() => el.classList.add('active'));
    }

    function closeModal(selector) {
        const el = document.querySelector(selector);
        if (el) el.classList.remove('active');
    }

    function closeAllModals() {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    }

    function handleFormSubmit(e) {
        e.preventDefault();

        const formData = new FormData(rsvpForm);
        const data = {};
        formData.forEach((value, key) => { data[key] = value; });

        console.log('RSVP Submitted:', data);
        if (typeof window.fireConfetti === 'function') {
            window.fireConfetti();
        }
        setTimeout(() => {
            openModal('#methodModal');
        }, 600);
        return false;
    }

    function setupSendMethodModal() {
        const methodModal = document.getElementById('methodModal');
        const contactModal = document.getElementById('contactModal');
        const methodButtons = methodModal?.querySelectorAll('.method-btn');
        const backBtn = document.getElementById('backToMethodBtn');
        const contactButtons = document.getElementById('contactOptions')?.querySelectorAll('.contact-option-btn');

        methodButtons?.forEach(btn => {
            btn.addEventListener('click', () => {
                const method = btn.dataset.method;
                methodModal.classList.remove('active');
                if (contactModal) {
                    contactModal.dataset.method = method;
                    requestAnimationFrame(() => contactModal.classList.add('active'));
                }
            });
        });

        backBtn?.addEventListener('click', () => {
            closeModal('#contactModal');
            openModal('#methodModal');
        });

        contactButtons?.forEach(btn => {
            btn.addEventListener('click', () => {
                const method = contactModal?.dataset.method || 'whatsapp';
                const phone = btn.dataset.phone;
                const message = encodeURIComponent(getRSVPMessage());
                let url = '';
                if (method === 'whatsapp') {
                    url = `https://wa.me/${phone}?text=${message}`;
                } else {
                    url = `sms:${phone}?body=${message}`;
                }
                closeAllModals();
                window.open(url, '_blank');
                if (rsvpForm) rsvpForm.style.display = 'none';
                if (rsvpSuccess) rsvpSuccess.classList.add('show');
            });
        });

        document.querySelectorAll('.modal-close-btn').forEach(btn => {
            if (!btn.id || btn.id !== 'backToMethodBtn') {
                btn.addEventListener('click', closeAllModals);
            }
        });

        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) closeAllModals();
            });
        });
    }

    // ---- Gallery Lightbox ----
    function openLightbox(index) {
        currentImageIndex = index;
        updateLightboxContent();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightboxContent() {
        const item = galleryItems[currentImageIndex];
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-caption');

        lightboxImg.src = img.src;
        lightboxCaption.textContent = caption ? caption.textContent : '';
    }

    function navigateLightbox(direction) {
        currentImageIndex = (currentImageIndex + direction + imagesArray.length) % imagesArray.length;
        updateLightboxContent();
    }

    function handleKeyboard(e) {
        if (!lightbox.classList.contains('active')) return;

        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                navigateLightbox(-1);
                break;
            case 'ArrowRight':
                navigateLightbox(1);
                break;
        }
    }

    // ---- Initialize Gallery ----
    function initGallery() {
        imagesArray = Array.from(galleryItems);

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });

        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }

        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateLightbox(-1);
        });

        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateLightbox(1);
        });

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', handleKeyboard);
    }

    // ---- Smooth scroll for all anchor links ----
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', smoothScroll);
        });
    }

    // ---- Active section highlight ----
    function highlightActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ---- Throttle function ----
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ---- Debounce function ----
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // ---- Celebration Cards ----
    function typewriter(element, text, speed = config.typewriterSpeed) {
        if (!element) return;
        if (element._typewriterTimeout) clearTimeout(element._typewriterTimeout);
        element.dataset.typed = 'true';
        element.textContent = '';
        let i = 0;

        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                element._typewriterTimeout = setTimeout(type, speed);
            } else {
                element.classList.remove('typewriter');
                element._typewriterTimeout = null;
            }
        }
        type();
    }

    function revealCelebrationCards() {
        if (!celebrationStage) return;

        const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -60px 0px' };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                const cards = Array.from(celebrationCards);
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('active');
                        const typewriterEl = card.querySelector('.typewriter');
                        if (typewriterEl) {
                            const text = typewriterEl.dataset.text || typewriterEl.textContent;
                            setTimeout(() => {
                                typewriter(typewriterEl, text);
                            }, config.typewriterDelay);
                        }
                        const mapEl = card.querySelector('.card-map');
                        if (mapEl) {
                            setTimeout(() => {
                                mapEl.classList.add('visible-map');
                                mapEl.classList.remove('hidden-map');
                            }, 800);
                        }
                    }, index * 400);
                });
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        observer.observe(celebrationStage);
    }

    function setupCoupleTypewriter() {
        const coupleTexts = document.querySelectorAll('.couple-solo-info .couple-card-text');
        if (!coupleTexts.length) return;

        if (coupleTypewriterObserver) {
            coupleTypewriterObserver.disconnect();
        }

        coupleTypewriterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    if (el.dataset.typed === 'true') return;
                    if (el._typewriterTimeout) clearTimeout(el._typewriterTimeout);

                    const fullText = el.dataset.originalText || el.textContent;
                    el.dataset.originalText = fullText;
                    el.textContent = '';
                    el.dataset.typed = 'true';
                    typewriter(el, fullText);

                    coupleTypewriterObserver.unobserve(el);
                }
            });
        }, { threshold: 0.2 });

        coupleTexts.forEach(el => {
            if (el.dataset.typed !== 'true') {
                coupleTypewriterObserver.observe(el);
            }
        });
    }

    function setupMapInteractions() {
        celebrationCards.forEach(card => {
            const mapEl = card.querySelector('.card-map');
            const btn = card.querySelector('.show-map-btn');

            if (!mapEl || !btn) return;

            // Desktop hover
            if (window.matchMedia('(hover: hover)').matches) {
                card.addEventListener('mouseenter', () => {
                    mapEl.classList.add('visible-map');
                    mapEl.classList.remove('hidden-map');
                });

                card.addEventListener('mouseleave', () => {
                    mapEl.classList.remove('visible-map');
                    mapEl.classList.add('hidden-map');
                });
            }

            // Mobile tap
            if (window.matchMedia('(hover: none)').matches || window.innerWidth <= 768) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const isVisible = mapEl.classList.contains('visible-map');
                    mapEl.classList.toggle('visible-map', !isVisible);
                    mapEl.classList.toggle('hidden-map', isVisible);
                });
            }
        });
    }

    function handleResize() {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }

        if (particlesContainer && window.innerWidth <= 768) {
            particlesContainer.innerHTML = '';
            createParticles();
        }

        setupMapInteractions();
        setupCoupleTypewriter();
    }

    // ---- Journey Carousels ----
    function initJourneyCarousels() {
        const chapters = document.querySelectorAll('.journey-chapter');

        chapters.forEach(chapter => {
            const slider = chapter.querySelector('.chapter-slider');
            const slides = chapter.querySelectorAll('.slide');
            const dots = chapter.querySelectorAll('.dot');
            const prevBtn = chapter.querySelector('.slider-arrow.prev');
            const nextBtn = chapter.querySelector('.slider-arrow.next');
            const videoWrapper = chapter.querySelector('.chapter-video-wrapper');
            const playVideoBtn = chapter.querySelector('.play-video-btn');
            const video = chapter.querySelector('.chapter-video');

            if (!slider || !slides.length) return;

            let currentIndex = 0;
            let autoplayInterval = null;
            const autoplayDelay = 4500;
            let touchStartX = 0;
            let touchEndX = 0;
            let isTransitioning = false;
            let isInView = false;

            function showSlide(index) {
                if (isTransitioning) return;
                isTransitioning = true;

                slides.forEach(s => s.classList.remove('active'));
                dots.forEach(d => d.classList.remove('active'));

                currentIndex = (index + slides.length) % slides.length;
                slides[currentIndex].classList.add('active');
                if (dots[currentIndex]) dots[currentIndex].classList.add('active');

                setTimeout(() => {
                    isTransitioning = false;
                }, 900);
            }

            function nextSlide() {
                showSlide(currentIndex + 1);
            }

            function prevSlide() {
                showSlide(currentIndex - 1);
            }

            function startAutoplay() {
                stopAutoplay();
                if (!isInView) return;
                autoplayInterval = setInterval(nextSlide, autoplayDelay);
            }

            function stopAutoplay() {
                if (autoplayInterval) {
                    clearInterval(autoplayInterval);
                    autoplayInterval = null;
                }
            }

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    isInView = entry.isIntersecting;
                    if (isInView) {
                        startAutoplay();
                    } else {
                        stopAutoplay();
                    }
                });
            }, { threshold: 0.3 });

            observer.observe(chapter);

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    prevSlide();
                    startAutoplay();
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    nextSlide();
                    startAutoplay();
                });
            }

            dots.forEach(dot => {
                dot.addEventListener('click', () => {
                    const index = parseInt(dot.dataset.index, 10);
                    showSlide(index);
                    startAutoplay();
                });
            });

            slider.addEventListener('mouseenter', stopAutoplay);
            slider.addEventListener('mouseleave', startAutoplay);

            slider.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                stopAutoplay();
            }, { passive: true });

            slider.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                const diff = touchStartX - touchEndX;
                const threshold = 50;

                if (Math.abs(diff) > threshold) {
                    if (diff > 0) {
                        nextSlide();
                    } else {
                        prevSlide();
                    }
                }
                startAutoplay();
            }, { passive: true });

            if (videoWrapper && playVideoBtn && video) {
                playVideoBtn.addEventListener('click', () => {
                    videoWrapper.classList.add('active');
                    video.currentTime = 0;
                    video.play().catch(() => {});
                    stopAutoplay();
                });

                const returnFromVideo = () => {
                    video.pause();
                    videoWrapper.classList.remove('active');
                    startAutoplay();
                };

                video.addEventListener('ended', returnFromVideo);
                video.addEventListener('click', returnFromVideo);

                const backBtn = chapter.querySelector('.video-back-btn');
                if (backBtn) {
                    backBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        returnFromVideo();
                    });
                }
            }
        });
    }

    // ---- Confetti System ----
    function initConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let confetti = [];
        let animationId;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resize();
        window.addEventListener('resize', resize);

        const colors = [
            '#E1773B',
            '#E8A77A',
            '#C1622C',
            '#8A9DB5',
            '#6B7F9A',
            '#5D77A8',
            '#8B7355',
            '#D4A574',
            '#F9F5F0',
            '#E8A77A'
        ];

        class Confetto {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height - canvas.height;
                this.size = Math.random() * 10 + 4;
                this.speedY = Math.random() * 6 + 4;
                this.speedX = Math.random() * 4 - 2;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.rotation = Math.random() * 360;
                this.rotationSpeed = Math.random() * 10 - 5;
                this.opacity = 1;
                this.shape = Math.random() > 0.5 ? 'rect' : 'circle';
            }

            update() {
                this.y += this.speedY;
                this.x += this.speedX;
                this.speedY += 0.05;
                this.rotation += this.rotationSpeed;
                this.opacity -= 0.003;

                if (this.y > canvas.height) {
                    this.y = -20;
                    this.x = Math.random() * canvas.width;
                    this.speedY = Math.random() * 6 + 4;
                    this.opacity = 1;
                }
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate((this.rotation * Math.PI) / 180);
                ctx.globalAlpha = Math.max(0, this.opacity);
                ctx.fillStyle = this.color;

                if (this.shape === 'rect') {
                    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
                } else {
                    ctx.beginPath();
                    ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();
            }
        }

        function createBurst(count = 150) {
            for (let i = 0; i < count; i++) {
                const c = new Confetto();
                c.y = Math.random() * canvas.height * 0.3;
                c.speedY = Math.random() * 8 + 2;
                c.speedX = Math.random() * 6 - 3;
                confetti.push(c);
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            confetti.forEach(c => {
                c.update();
                c.draw();
            });
            confetti = confetti.filter(c => c.opacity > 0);
            if (confetti.length > 0) {
                animationId = requestAnimationFrame(animate);
            }
        }

        function fire() {
            createBurst(200);
            if (confetti.length <= 200) {
                cancelAnimationFrame(animationId);
                animate();
            }
        }

        window.fireConfetti = fire;

        // Clean up on page unload
        window.addEventListener('beforeunload', () => {
            cancelAnimationFrame(animationId);
        });
    }
   // ---- Auto Scroll ----
    function initAutoScroll() {
        let animationId;
        let active = true;
        const savedScrollBehavior = document.documentElement.style.scrollBehavior;

        const hero = document.querySelector('.hero');
        if (!hero) return;

        const startDelay = 1200;
        const minSpeed = 1.8;
        const maxSpeed = 5.0;

        function stopAutoScroll() {
            if (!active) return;
            active = false;
            cancelAnimationFrame(animationId);
            document.documentElement.style.scrollBehavior = savedScrollBehavior;
            document.removeEventListener('click', stopAutoScroll);
            document.removeEventListener('touchstart', stopAutoScroll);
            document.removeEventListener('wheel', stopAutoScroll);
            document.removeEventListener('keydown', stopAutoScroll);
        }

        function step() {
            if (!active) return;

            const totalScroll = document.body.scrollHeight - window.innerHeight;
            const progress = Math.min(1, window.scrollY / totalScroll);

            if (progress >= 0.98) {
                stopAutoScroll();
                return;
            }

            const speed = minSpeed + (maxSpeed - minSpeed) * (0.5 + 0.5 * Math.sin(progress * Math.PI));
            window.scrollBy(0, speed);

            animationId = requestAnimationFrame(step);
        }

        setTimeout(() => {
            document.documentElement.style.scrollBehavior = 'auto';
            animationId = requestAnimationFrame(step);
            document.addEventListener('click', stopAutoScroll, { once: true });
            document.addEventListener('touchstart', stopAutoScroll, { once: true });
        }, startDelay);

        document.addEventListener('wheel', stopAutoScroll, { once: true });
        document.addEventListener('keydown', stopAutoScroll, { once: true });
    }
    // ---- Cinematic Gallery ----
    function initCinematicGallery() {
        const track = document.querySelector('.gallery-track');
        const wrapper = document.querySelector('.gallery-track-wrapper');
        if (!track || !wrapper) return;

        const cards = track.querySelectorAll('.gallery-card');
        let isDown = false;
        let startX, scrollLeftPos;

        function onMouseDown(e) {
            isDown = true;
            wrapper.style.cursor = 'grabbing';
            startX = e.pageX - wrapper.offsetLeft;
            scrollLeftPos = wrapper.scrollLeft;
        }

        function onMouseLeave() {
            isDown = false;
            wrapper.style.cursor = 'grab';
        }

        function onMouseUp() {
            isDown = false;
            wrapper.style.cursor = 'grab';
        }

        function onMouseMove(e) {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - wrapper.offsetLeft;
            const walk = (x - startX) * 1.5;
            wrapper.scrollLeft = scrollLeftPos - walk;
        }

        function onWheel(e) {
            if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) {
                wrapper.scrollLeft += e.deltaY;
            }
        }

        wrapper.addEventListener('mousedown', onMouseDown);
        wrapper.addEventListener('mouseleave', onMouseLeave);
        wrapper.addEventListener('mouseup', onMouseUp);
        wrapper.addEventListener('mousemove', onMouseMove);
        wrapper.addEventListener('wheel', onWheel, { passive: true });

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -8;
                const rotateY = ((x - centerX) / centerX) * 8;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });

        imagesArray = Array.from(cards);

        window.addEventListener('resize', () => {
            wrapper.style.cursor = 'grab';
        });
    }



    // ---- Music Sync ----
     function initMusicSync() {
         const bgMusic = document.getElementById('bg-music');
         if (!journeyVideo || !bgMusic) return;

         let musicWasPlayingBeforeVideo = false;

         bgMusic.volume = 0.5;

         const unlockAudio = () => {
             if (audioContext && audioContext.state === 'suspended') {
                 audioContext.resume();
             }
             bgMusic.play().catch(() => {});
             document.removeEventListener('click', unlockAudio);
             document.removeEventListener('touchstart', unlockAudio);
         };

          document.addEventListener('click', unlockAudio, { once: true });
          document.addEventListener('touchstart', unlockAudio, { once: true });

          bgMusic.play().catch(() => {});

         journeyVideo.addEventListener('play', () => {
             if (!bgMusic.paused) {
                 musicWasPlayingBeforeVideo = true;
                 bgMusic.pause();
             }
         });

         journeyVideo.addEventListener('pause', () => {
             if (musicWasPlayingBeforeVideo) {
                 bgMusic.play().catch(() => {});
                 musicWasPlayingBeforeVideo = false;
             }
         });

           journeyVideo.addEventListener('ended', () => {
               bgMusic.play().catch(() => {});
               musicWasPlayingBeforeVideo = false;
           });
       }

     // ---- Music Player & Visualizer ----
     function setupAudioVisualizer() {
         const bgMusic = document.getElementById('bg-music');
         if (!bgMusic || !musicVisualizer) return;

         try {
             audioContext = new (window.AudioContext || window.webkitAudioContext)();
             analyser = audioContext.createAnalyser();
             analyser.fftSize = 32;
             analyser.smoothingTimeConstant = 0.75;

             const source = audioContext.createMediaElementSource(bgMusic);
             source.connect(analyser);
             analyser.connect(audioContext.destination);

             vizBars = Array.from(musicVisualizer.querySelectorAll('.viz-bar'));
             const bufferLength = analyser.frequencyBinCount;
             const dataArray = new Uint8Array(bufferLength);

             function updateBars() {
                 if (!analyser) return;

                 analyser.getByteFrequencyData(dataArray);
                 const step = Math.max(1, Math.floor(bufferLength / vizBars.length));

                 vizBars.forEach((bar, i) => {
                     const idx = Math.min(i * step, bufferLength - 1);
                     const value = dataArray[idx] || 0;
                     const height = Math.max(4, (value / 255) * 22);
                     bar.style.height = `${height}px`;
                 });

                 vizAnimationId = requestAnimationFrame(updateBars);
             }

             updateBars();
         } catch (e) {
             console.warn('Audio visualizer not supported:', e);
             fallbackVisualizer();
         }
     }

     function fallbackVisualizer() {
         const bgMusic = document.getElementById('bg-music');
         if (!bgMusic) return;

         bgMusic.addEventListener('play', () => musicPlayer?.classList.add('playing'));
         bgMusic.addEventListener('pause', () => musicPlayer?.classList.remove('playing'));
         bgMusic.addEventListener('ended', () => musicPlayer?.classList.remove('playing'));
     }

     function updateMusicPlayerUI(isPlaying) {
         if (!musicPlayer || !mpIconPlay || !mpIconPause) return;

         if (isPlaying) {
             musicPlayer.classList.add('playing');
             mpIconPlay.style.display = 'none';
             mpIconPause.style.display = 'block';
             if (musicPlayerBtn) musicPlayerBtn.setAttribute('aria-label', 'Pause music');
         } else {
             musicPlayer.classList.remove('playing');
             mpIconPlay.style.display = 'block';
             mpIconPause.style.display = 'none';
             if (musicPlayerBtn) musicPlayerBtn.setAttribute('aria-label', 'Play music');
         }
     }

     function toggleMusic() {
         const bgMusic = document.getElementById('bg-music');
         if (!bgMusic) return;

         if (audioContext && audioContext.state === 'suspended') {
             audioContext.resume();
         }

         if (bgMusic.paused) {
             bgMusic.play().then(() => {
                 updateMusicPlayerUI(true);
             }).catch(() => {});
         } else {
             bgMusic.pause();
             updateMusicPlayerUI(false);
         }
     }

     function setupMusicPlayer() {
         const bgMusic = document.getElementById('bg-music');
         if (!bgMusic || !musicPlayerBtn) return;

         musicPlayerBtn.addEventListener('click', (e) => {
             e.stopPropagation();
             toggleMusic();
         });

         bgMusic.addEventListener('play', () => updateMusicPlayerUI(true));
         bgMusic.addEventListener('pause', () => updateMusicPlayerUI(false));
         bgMusic.addEventListener('ended', () => updateMusicPlayerUI(false));

         setupAudioVisualizer();
     }

    function handleJourneyVideoScrollAway() {
        const journeySection = document.getElementById('journey');
        if (!journeySection || !journeyVideo) return;

        const rect = journeySection.getBoundingClientRect();
        const isScrolledPast = rect.bottom < 0;

        if (isScrolledPast && !journeyVideo.paused) {
            journeyVideo.pause().catch(() => {});

            const wrapper = journeyVideo.closest('.chapter-video-wrapper');
            if (wrapper) {
                wrapper.classList.remove('active');
            }

            const bgMusic = document.getElementById('bg-music');
            if (bgMusic && bgMusic.paused) {
                bgMusic.play().catch(() => {});
            }
        }
    }

    // ---- Wishes Section ----
    function initWishesSection() {
        const track = document.getElementById('wishesTrack');
        const wishModalForm = document.getElementById('wishModalForm');
        const wishModalOverlay = document.getElementById('wishModalOverlay');
        const wishModalSkip = document.querySelector('.wish-modal-skip');
        const wishModalName = document.getElementById('wishModalName');
        const wishModalRelation = document.getElementById('wishModalRelation');
        const wishModalMessage = document.getElementById('wishModalMessage');
        const wishesCtaBtn = document.getElementById('wishesCtaBtn');

        if (!track) return;

        const WISHES_KEY = 'edwin_regina_wishes';
        const MAX_WISHES = 12;

        function getWishes() {
            try {
                const data = localStorage.getItem(WISHES_KEY);
                return data ? JSON.parse(data) : [];
            } catch (e) {
                return [];
            }
        }

        function saveWishes(wishes) {
            localStorage.setItem(WISHES_KEY, JSON.stringify(wishes));
        }

        function addWish(name, relation, message) {
            const wishes = getWishes();
            const newWish = {
                id: 'wish-' + Date.now(),
                name: name.trim(),
                relation: relation.trim(),
                message: message.trim(),
                date: new Date().toISOString()
            };
            wishes.unshift(newWish);
            while (wishes.length > MAX_WISHES) {
                wishes.pop();
            }
            saveWishes(wishes);
            return newWish;
        }

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        function formatTimeAgo(dateString) {
            const diff = Date.now() - new Date(dateString).getTime();
            const minutes = Math.floor(diff / 60000);
            const hours = Math.floor(diff / 3600000);
            const days = Math.floor(diff / 86400000);
            if (minutes < 1) return 'Just now';
            if (minutes < 60) return `${minutes}m ago`;
            if (hours < 24) return `${hours}h ago`;
            if (days < 7) return `${days}d ago`;
            return 'Recent';
        }

        function createUserWishCard(wish) {
            const card = document.createElement('div');
            card.className = 'wish-card-prism';
            card.setAttribute('data-wish-id', wish.id);

            const initials = wish.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
            const dateLabel = formatTimeAgo(wish.date);

            card.innerHTML = `
                <div class="prism-border"></div>
                <div class="wish-prism-inner">
                    <div class="wish-prism-header">
                        <div class="wish-avatar wish-avatar--gold">${initials}</div>
                        <div>
                            <div class="wish-prism-name">${escapeHtml(wish.name)}</div>
                            <div class="wish-prism-relation">${escapeHtml(wish.relation || 'Wedding Guest')}</div>
                        </div>
                    </div>
                    <p class="wish-prism-message">${escapeHtml(wish.message)}</p>
                    <div class="wish-prism-footer">
                        <span class="wish-prism-dot"></span>
                        <span class="wish-prism-date">${dateLabel}</span>
                    </div>
                </div>
            `;
            return card;
        }

        function rebuildCarousel() {
            const wishes = getWishes();
            const exampleCards = track.querySelectorAll('[data-wish-id^="ex-"]');
            const exampleWishes = Array.from(exampleCards).map(card => ({
                id: card.getAttribute('data-wish-id'),
                name: card.querySelector('.wish-prism-name')?.textContent || '',
                message: card.querySelector('.wish-prism-message')?.textContent || '',
                relation: card.querySelector('.wish-prism-relation')?.textContent || '',
                date: card.querySelector('.wish-prism-date')?.textContent || ''
            }));

            const allWishes = [...wishes, ...exampleWishes];
            const limited = allWishes.slice(0, MAX_WISHES);

            track.innerHTML = '';
            originals = [];

            limited.forEach(wish => {
                const card = document.createElement('div');
                card.className = 'wish-card-prism';
                card.setAttribute('data-wish-id', wish.id);

                const initials = wish.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                const isUserWish = !wish.id.startsWith('ex-');
                const dateLabel = isUserWish ? formatTimeAgo(wish.date) : (wish.date || 'Wedding Guest');

                card.innerHTML = `
                    <div class="prism-border"></div>
                    <div class="wish-prism-inner">
                        <div class="wish-prism-header">
                            <div class="wish-avatar wish-avatar--gold">${initials}</div>
                            <div>
                                <div class="wish-prism-name">${escapeHtml(wish.name)}</div>
                                <div class="wish-prism-relation">${escapeHtml(wish.relation || 'Wedding Guest')}</div>
                            </div>
                        </div>
                        <p class="wish-prism-message">${escapeHtml(wish.message)}</p>
                        <div class="wish-prism-footer">
                            <span class="wish-prism-dot"></span>
                            <span class="wish-prism-date">${dateLabel}</span>
                        </div>
                    </div>
                `;
                originals.push(card);
            });

            track.innerHTML = '';
            const frag1 = document.createDocumentFragment();
            originals.forEach(c => frag1.appendChild(c));
            track.appendChild(frag1);
            const frag2 = document.createDocumentFragment();
            originals.forEach(c => frag2.appendChild(c.cloneNode(true)));
            track.appendChild(frag2);

            pos = 0;
        }

        function openWishModal() {
            if (wishModalOverlay) {
                wishModalOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
                if (wishModalName) wishModalName.focus();
            }
        }

        function closeWishModal() {
            if (wishModalOverlay) {
                wishModalOverlay.classList.remove('active');
                document.body.style.overflow = '';
                if (wishModalForm) wishModalForm.reset();
            }
        }

        if (wishModalSkip) {
            wishModalSkip.addEventListener('click', closeWishModal);
        }

        if (wishModalOverlay) {
            wishModalOverlay.addEventListener('click', (e) => {
                if (e.target === wishModalOverlay) closeWishModal();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && wishModalOverlay?.classList.contains('active')) {
                closeWishModal();
            }
        });

        if (wishModalForm) {
            wishModalForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = wishModalName?.value || '';
                const relation = wishModalRelation?.value || '';
                const message = wishModalMessage?.value || '';
                if (!name.trim() || !relation.trim() || !message.trim()) return;
                const wish = addWish(name, relation, message);
                rebuildCarousel();
                closeWishModal();
            });
        }

        if (wishesCtaBtn) {
            wishesCtaBtn.addEventListener('click', openWishModal);
        }

        // ---- Carousel Logic ----
        let pos = 0;
        let speed = 0.7;
        let paused = false;
        let resumeTimeout = null;
        let lastTime = null;
        let originals = [];

        function setupCarouselPause() {
            track.addEventListener('pointerenter', () => {
                paused = true;
                clearTimeout(resumeTimeout);
            });

            track.addEventListener('pointerleave', () => {
                resumeTimeout = setTimeout(() => { paused = false; }, 600);
            });

            track.addEventListener('pointerdown', () => {
                paused = true;
                clearTimeout(resumeTimeout);
            });

            track.addEventListener('pointerup', () => {
                clearTimeout(resumeTimeout);
                resumeTimeout = setTimeout(() => { paused = false; }, 2000);
            });
        }

        function animateCarousel(timestamp) {
            if (!lastTime) lastTime = timestamp;
            const dt = Math.min((timestamp - lastTime) / 16.667, 3);
            lastTime = timestamp;

            if (!paused) {
                pos -= speed * dt;
                const half = track.scrollWidth / 2;
                if (pos <= -half) pos += half;
                if (pos > 0) pos -= half;
                track.style.transform = `translateX(${pos}px)`;
            }

            requestAnimationFrame(animateCarousel);
        }

        setupCarouselPause();
        setTimeout(rebuildCarousel, 100);
        requestAnimationFrame(animateCarousel);

        // Floating hearts
        function createFloatingHeart() {
            const container = document.getElementById('wishesParticles');
            if (!container) return;
            const heart = document.createElement('div');
            heart.className = 'wishes-particle';
            heart.textContent = '♥';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.bottom = '-20px';
            heart.style.fontSize = (Math.random() * 16 + 12) + 'px';
            heart.style.animationDuration = (Math.random() * 8 + 10) + 's';
            heart.style.animationDelay = Math.random() * 5 + 's';
            container.appendChild(heart);
            setTimeout(() => heart.remove(), 20000);
        }

        const particlesContainer = document.getElementById('wishesParticles');
        if (particlesContainer) {
            for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                    createFloatingHeart();
                    setInterval(createFloatingHeart, 3000 + Math.random() * 4000);
                }, i * 800);
            }
        }

        window.addEventListener('resize', () => {
            requestAnimationFrame(rebuildCarousel);
        });

        window.openWishModal = openWishModal;
        window.closeWishModal = closeWishModal;
        window.addWish = addWish;
    }



    // ---- Initialize ----
     function init() {
        // Event listeners
        window.addEventListener('scroll', throttle(() => {
            handleNavbarScroll();
            highlightActiveSection();
            requestParallaxUpdate();
            handleJourneyVideoScrollAway();
        }, 16));

        if (navToggle) {
            navToggle.addEventListener('click', toggleMobileMenu);
        }

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        if (rsvpForm) {
            rsvpForm.addEventListener('submit', handleFormSubmit);
        }

        // Initialize components
        setupScrollReveal();
        setupCoupleTypewriter();
        initSectionReveal();
        initGallery();
        initSmoothScroll();
        setupVideoFallback();
        initCountdown(); // Initialize countdown
        initJourneyCarousels(); // Journey carousels
        revealCelebrationCards(); // Celebration card reveals
        setupMapInteractions();
        setupSendMethodModal(); // RSVP send method modal
        initConfetti();
        initCinematicGallery();
        initAutoScroll();
        setupMusicPlayer();
        initMusicSync();
        initWishesSection();

        window.addEventListener('resize', debounce(handleResize, 250));

        // Initial check
        handleNavbarScroll();
        highlightActiveSection();

        // Add loaded class for initial animations
        document.body.classList.add('loaded');
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }



})();