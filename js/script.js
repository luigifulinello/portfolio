// script.js

document.addEventListener('DOMContentLoaded', function() {
    console.log('JavaScript is connected!');
});

document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.nav-button');
    const mobileDropdown = document.querySelector('.mobile-dropdown');
    const sections = document.querySelectorAll('section');

    // Handle button clicks
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            buttons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Scroll to corresponding section
            const sectionId = this.textContent.toLowerCase();
            document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Handle mobile dropdown
    mobileDropdown.addEventListener('change', function() {
        const sectionId = this.value.toLowerCase();
        document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
    });
});