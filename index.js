document.addEventListener('DOMContentLoaded', () => {

    // --- MOBILE MENU TOGGLE ---
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
        });
    }

    // --- SMOOTH SCROLL & ACTIVE LINK LOGIC ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const allLinks = [...navLinks, ...mobileNavLinks];
    const navHeight = document.querySelector('.navbar').offsetHeight;

    // Function to handle smooth scrolling
    const smoothScroll = (e) => {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        if (!targetId || !targetId.startsWith('#')) return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navHeight;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if it's open
            if (mobileMenu.classList.contains('open')) {
                mobileMenu.classList.remove('open');
            }
        }
    };
    
    allLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });

    // --- ACTIVE LINK HIGHLIGHTING USING INTERSECTION OBSERVER ---
    const observerOptions = {
        root: null,
        rootMargin: `-${navHeight}px 0px -70% 0px`,
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const correspondingNavLink = document.querySelector(`.nav-link[href="#${id}"]`);
            
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingNavLink) {
                    correspondingNavLink.classList.add('active');
                }
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(section => observer.observe(section));


    // --- CONTACT FORM SUBMISSION ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // In a real application, you would send this to a server
            console.log('Form Submitted:', { name, email, message });
            
            alert('Thank you for your message! I will get back to you soon.');
            
            this.reset();
        });
    }
});