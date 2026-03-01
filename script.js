document.addEventListener('DOMContentLoaded', async () => {
    await injectNavbar();
    initNavigation();
    initReveal();
    initLeadership();
    initFloatingDonate();
    initParallaxBanner();
});

async function injectNavbar() {
    const target = document.querySelector('[data-include="navbar"]');
    if (!target) return;

    try {
        const response = await fetch('partials/navbar.html', { cache: 'no-cache' });
        if (!response.ok) throw new Error(`Navbar request failed: ${response.status}`);
        const markup = await response.text();
        target.innerHTML = markup;
    } catch (error) {
        console.error('Could not load navbar include', error);
    }
}

function initNavigation() {
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            hamburger.classList.toggle('open');
        });
    }

    // --- Active Nav Link Highlighter ---
    // This script is simple and works by checking the filename.
    const currentLocation = window.location.pathname.split('/').pop();
    const allNavLinks = document.querySelectorAll('.nav-links a');

    allNavLinks.forEach(link => {
        const linkHref = link.getAttribute('href').split('/').pop();
        
        // Remove active from all first
        link.classList.remove('active');

        // Add active to the matching link
        if (currentLocation === '' && linkHref === 'index.html') {
            // Handle root path for home
            link.classList.add('active');
        } else if (currentLocation === linkHref) {
            link.classList.add('active');
        }
    });
}

function initReveal() {
    // --- Scroll Reveal Animations ---
    const revealSelectors = [
        '.hero-content',
        '.page-content',
        '.pillar-card',
        '.stat-card',
        '.mission-grid .card',
        '.services-grid .service-card',
        '.survey-charts > div',
        '.testimonial',
        '.plan-highlight .cta-panel',
        '.phase-card',
        '.survey-to-action .data-card',
        '.giving-card',
        '.partner-section .partner-card',
        '.volunteer-section .story-card',
        '.contact-card',
        '.support-preview-inner',
        '.support-actions a',
        '.impact-list li'
    ];

    const revealElements = Array.from(document.querySelectorAll(revealSelectors.join(', ')));
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealVariants = ['lift', 'slide-left', 'slide-right', 'zoom'];

    let currentSection = null;
    let sequenceIndex = 0;

    revealElements.forEach(el => {
        el.classList.add('reveal');

        const section = el.closest('section, header, footer, main') || document.body;
        if (section !== currentSection) {
            currentSection = section;
            sequenceIndex = 0;
        }

        const delay = Math.min(sequenceIndex * 0.14, 0.56);
        el.style.setProperty('--reveal-delay', `${delay}s`);

        const variant = revealVariants[sequenceIndex % revealVariants.length];
        el.dataset.revealVariant = variant;

        sequenceIndex += 1;
    });

    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -10% 0px'
        });

        revealElements.forEach(el => observer.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('reveal-visible'));
    }
}

function initLeadership() {
    const cards = Array.from(document.querySelectorAll('.leader-card'));
    if (!cards.length) return;

    const modal = document.getElementById('leader-modal');
    if (!modal) return;
    const backdrop = modal?.querySelector('.leader-modal-backdrop');
    const nameEl = modal?.querySelector('#leader-modal-name');
    const roleEl = modal?.querySelector('#leader-modal-role');
    const bioEl = modal?.querySelector('#leader-modal-bio');
    const closeBtn = modal?.querySelector('.leader-close');
    const prevBtn = modal?.querySelector('.leader-prev');
    const nextBtn = modal?.querySelector('.leader-next');

    let activeIndex = 0;

    const openModal = (index) => {
        activeIndex = (index + cards.length) % cards.length;
        const card = cards[activeIndex];
        const name = card.dataset.name || '';
        const role = card.dataset.role || '';
        const bio = card.dataset.bio || 'Bio coming soon.';

        if (nameEl) nameEl.textContent = name;
        if (roleEl) roleEl.textContent = role;
        if (bioEl) bioEl.textContent = bio;

        modal?.classList.add('active');
        modal?.setAttribute('aria-hidden', 'false');
        closeBtn?.focus({ preventScroll: true });
    };

    const closeModal = () => {
        modal?.classList.remove('active');
        modal?.setAttribute('aria-hidden', 'true');
    };

    const showPrev = () => openModal(activeIndex - 1);
    const showNext = () => openModal(activeIndex + 1);

    cards.forEach((card, index) => {
        const trigger = card.querySelector('.leader-expand') || card;
        trigger.addEventListener('click', (event) => {
            event.stopPropagation();
            openModal(index);
        });
        card.addEventListener('click', () => openModal(index));
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                openModal(index);
            }
        });
        card.setAttribute('tabindex', '0');
    });

    closeBtn?.addEventListener('click', closeModal);
    backdrop?.addEventListener('click', closeModal);
    prevBtn?.addEventListener('click', showPrev);
    nextBtn?.addEventListener('click', showNext);

    document.addEventListener('keydown', (e) => {
        if (!modal?.classList.contains('active')) return;
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });
}

function initFloatingDonate() {
    const donateButton = document.querySelector('.floating-donate');
    const missionSection = document.querySelector('#mission');
    if (!donateButton || !missionSection) return;

    const show = () => donateButton.classList.add('active');
    const hide = () => donateButton.classList.remove('active');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    hide();
                } else {
                    show();
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -10% 0px'
        });
        observer.observe(missionSection);
    } else {
        // Fallback for older browsers
        const check = () => {
            const rect = missionSection.getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > window.innerHeight) {
                show();
            } else {
                hide();
            }
        };
        window.addEventListener('scroll', check, { passive: true });
        check();
    }
}

function initParallaxBanner() {
    const banners = Array.from(document.querySelectorAll('.parallax-banner'));
    if (!banners.length) return;

    const update = () => {
        banners.forEach((el) => {
            const speed = parseFloat(el.dataset.parallaxSpeed || '0.25');
            const rect = el.getBoundingClientRect();
            const scrolled = window.scrollY || window.pageYOffset;
            const offsetTop = el.offsetTop;
            const yPos = (scrolled - offsetTop) * speed;
            el.style.backgroundPosition = `center calc(50% + ${yPos}px)`;
        });
    };

    let ticking = false;
    const onScroll = () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                update();
                ticking = false;
            });
            ticking = true;
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    update();
}