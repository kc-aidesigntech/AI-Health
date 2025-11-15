document.addEventListener('DOMContentLoaded', function() {

    // --- Mobile Hamburger Menu ---
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

    const revealElements = document.querySelectorAll(revealSelectors.join(', '));
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    revealElements.forEach(el => el.classList.add('reveal'));

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

});