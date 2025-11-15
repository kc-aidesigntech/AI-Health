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

});