document.addEventListener('DOMContentLoaded', () => {

    // -------------------------------------------------------------
    // 1. Header scroll effect
    // -------------------------------------------------------------
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // -------------------------------------------------------------
    // 2. Mobile Menu Toggle
    // -------------------------------------------------------------
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const closeDrawerBtn = document.getElementById('closeDrawerBtn');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    function openMobileMenu() {
        mobileDrawer.classList.add('active');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileDrawer.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', openMobileMenu);
    }

    if (closeDrawerBtn) {
        closeDrawerBtn.addEventListener('click', closeMobileMenu);
    }

    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMobileMenu);
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // -------------------------------------------------------------
    // 3. Treatments 'Saiba Mais' Accordion/Expand logic
    // -------------------------------------------------------------
    const learnMoreButtons = document.querySelectorAll('.btn-learn-more');

    learnMoreButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const card = button.closest('.treatment-card');
            const detail = card.querySelector('.treatment-detail');
            const isCurrentlyActive = detail.classList.contains('active');

            // Close other opened details
            document.querySelectorAll('.treatment-detail').forEach(d => {
                d.classList.remove('active');
                d.style.maxHeight = null;
            });
            document.querySelectorAll('.btn-learn-more').forEach(b => {
                b.innerHTML = 'Saiba Mais <span>&rarr;</span>';
            });

            if (!isCurrentlyActive) {
                detail.classList.add('active');
                detail.style.maxHeight = detail.scrollHeight + "px";
                button.innerHTML = 'Fechar <span>&uarr;</span>';
            } else {
                detail.classList.remove('active');
                detail.style.maxHeight = null;
                button.innerHTML = 'Saiba Mais <span>&rarr;</span>';
            }
        });
    });

    // -------------------------------------------------------------
    // 4. Testimonials Slider with Dots Pagination
    // -------------------------------------------------------------
    const sliderContainer = document.getElementById('sliderContainer');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const sliderDots = document.getElementById('sliderDots');

    if (sliderContainer && prevBtn && nextBtn) {
        let currentIndex = 0;
        const slides = document.querySelectorAll('.slide');
        const totalSlides = slides.length;

        function getVisibleSlidesCount() {
            return window.innerWidth <= 768 ? 1 : 2;
        }

        function renderDots() {
            if (!sliderDots) return;
            sliderDots.innerHTML = '';
            const visibleCount = getVisibleSlidesCount();
            const maxIndex = totalSlides - visibleCount;

            for (let i = 0; i <= maxIndex; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === currentIndex) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    currentIndex = i;
                    updateSlider();
                });
                sliderDots.appendChild(dot);
            }
        }

        function updateSlider() {
            const visibleCount = getVisibleSlidesCount();
            const maxIndex = totalSlides - visibleCount;

            if (currentIndex > maxIndex) currentIndex = maxIndex;
            if (currentIndex < 0) currentIndex = 0;

            sliderContainer.style.transform = `translateX(-${currentIndex * (100 / visibleCount + (12 / sliderContainer.clientWidth * 100))}%)`;

            // Disable buttons if at limit
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= maxIndex;

            // Sync active dot
            if (sliderDots) {
                const dots = sliderDots.querySelectorAll('.dot');
                dots.forEach((dot, idx) => {
                    if (idx === currentIndex) dot.classList.add('active');
                    else dot.classList.remove('active');
                });
            }
        }

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        });

        nextBtn.addEventListener('click', () => {
            const visibleCount = getVisibleSlidesCount();
            const maxIndex = totalSlides - visibleCount;
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateSlider();
            }
        });

        window.addEventListener('resize', () => {
            renderDots();
            updateSlider();
        });

        // Initial setup
        renderDots();
        updateSlider();
    }

    // -------------------------------------------------------------
    // 5. FAQ Accordion Toggle
    // -------------------------------------------------------------
    const faqHeaders = document.querySelectorAll('.accordion-header');

    faqHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isCurrentlyActive = header.classList.contains('active');

            // Close all items
            faqHeaders.forEach(h => {
                h.classList.remove('active');
                h.nextElementSibling.style.maxHeight = null;
            });

            if (!isCurrentlyActive) {
                header.classList.add('active');
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // -------------------------------------------------------------
    // 6. Scroll Reveal Observer
    // -------------------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // -------------------------------------------------------------
    // 7. Galeria Auto-scroll on Mobile
    // -------------------------------------------------------------
    const galeriaGrid = document.querySelector('.galeria-grid');
    if (galeriaGrid) {
        let scrollInterval;

        function startGaleriaScroll() {
            if (window.innerWidth <= 992) {
                if (!scrollInterval) {
                    scrollInterval = setInterval(() => {
                        const maxScroll = galeriaGrid.scrollWidth - galeriaGrid.clientWidth;
                        let nextScroll = galeriaGrid.scrollLeft + galeriaGrid.clientWidth * 0.85;

                        if (galeriaGrid.scrollLeft >= maxScroll - 10) {
                            nextScroll = 0;
                        }

                        galeriaGrid.scrollTo({
                            left: nextScroll,
                            behavior: 'smooth'
                        });
                    }, 3000);
                }
            } else {
                if (scrollInterval) {
                    clearInterval(scrollInterval);
                    scrollInterval = null;
                }
            }
        }

        startGaleriaScroll();
        window.addEventListener('resize', startGaleriaScroll);

        galeriaGrid.addEventListener('touchstart', () => {
            if (scrollInterval) {
                clearInterval(scrollInterval);
                scrollInterval = null;
            }
        }, { passive: true });

        galeriaGrid.addEventListener('touchend', () => {
            setTimeout(startGaleriaScroll, 3000);
        }, { passive: true });
    }

    // -------------------------------------------------------------
    // 8. Gallery Carousel Auto-scroll Loop
    // -------------------------------------------------------------
    // CSS infinite animation is used instead.

    // -------------------------------------------------------------
    // 9. Doctor Modals
    // -------------------------------------------------------------
    const modalButtons = document.querySelectorAll('[data-modal]');
    const doctorModals = document.querySelectorAll('.doctor-modal-overlay');
    const doctorCloseButtons = document.querySelectorAll('.doctor-modal-close');

    modalButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = btn.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    doctorCloseButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.doctor-modal-overlay');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    doctorModals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
});

