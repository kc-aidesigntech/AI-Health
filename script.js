document.addEventListener('DOMContentLoaded', async () => {
    await injectNavbar();
    initNavigation();
    initReveal();
    initLeadership();
    initFloatingDonate();
    initParallaxBanner();
    const progressConfig = await loadGivingProgress();
    if (progressConfig) applyGivingProgress(progressConfig);
    initThermometers(progressConfig);
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

async function loadGivingProgress() {
    try {
        const res = await fetch('giving-progress.json', { cache: 'no-cache' });
        if (!res.ok) return null;
        return await res.json();
    } catch (err) {
        console.warn('Could not load giving-progress.json', err);
        return null;
    }
}

function applyGivingProgress(config) {
    const card = document.querySelector('.thermo-card');
    if (!card || !config) return;
    if (config.goal) card.dataset.goal = config.goal;
    if (config.current) card.dataset.current = config.current;
    if (config.updated) card.dataset.updated = config.updated;
    if (config.tickLabelOffset !== undefined) {
        card.dataset.tickLabelOffset = config.tickLabelOffset;
    }
}

function initThermometers(config) {
    const cards = document.querySelectorAll('.thermo-card');
    if (!cards.length) return;

    cards.forEach(card => {
        const goal = parseFloat(card.dataset.goal || config?.goal || '0');
        const currentRaw = parseFloat(card.dataset.current || config?.current || '0');
        const current = goal > 0 ? Math.min(currentRaw, goal) : currentRaw;
        const fill = card.querySelector('.thermo-fill');
        const label = card.querySelector('[data-thermo-label]');
        const updated = card.dataset.updated || config?.updated;
        const updatedEl = card.querySelector('.thermo-updated');
        const ticksWrap = card.querySelector('.thermo-ticks');
        const tickLabelOffset = parseFloat((config?.tickLabelOffset ?? card.dataset.tickLabelOffset ?? '0'));
        const divisions = parseInt((config?.divisions ?? card.dataset.divisions ?? '4'), 10);
        const bulb = card.querySelector('.thermo-bulb');

        if (goal > 0 && fill) {
            const pct = Math.max(0, Math.min(100, (current / goal) * 100));
            fill.style.height = `${pct}%`;
            // Blend from blue to evergreen based on percent (0 -> blue, 100 -> green)
            const start = [12, 123, 189]; // primary-rgb
            const end = [89, 168, 137];   // evergreen-teal-rgb
            const t = pct / 100;
            const mix = start.map((c, i) => Math.round(c + (end[i] - c) * t));
            const color = `rgb(${mix.join(',')})`;
            fill.style.background = color;
            if (bulb) bulb.style.background = color;
        }

        if (label) {
            const currentText = isNaN(currentRaw) ? '—' : `$${Math.round(currentRaw).toLocaleString()}`;
            const goalText = goal > 0 ? `$${Math.round(goal).toLocaleString()}` : 'Goal TBD';
            label.textContent = `${currentText} of ${goalText}`;
        }

        if (updatedEl && updated) {
            updatedEl.textContent = `Updated ${updated}`;
        }

        if (ticksWrap && goal > 0) {
            const fractions = Array.from({ length: Math.max(1, divisions - 1) }, (_, i) => (i + 1) / divisions);
            const ticks = fractions.map(f => {
                const raw = goal * f;
                const rounded = Math.max(500, Math.round(raw / 500) * 500);
                const val = Math.min(goal, rounded);
                const pct = Math.max(0, Math.min(100, (val / goal) * 100));
                return { val, pct };
            });
            ticksWrap.style.setProperty('--tick-label-offset', `${tickLabelOffset}px`);
            ticksWrap.innerHTML = ticks.map(t => `
                <span class="tick" style="top:${100 - t.pct}%">
                    <span class="tick-line"></span>
                    <span class="tick-label">${t.val.toLocaleString()}</span>
                </span>
            `).join('');
        }
    });
}