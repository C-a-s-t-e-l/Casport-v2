document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
        });
    }

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const allLinks = [...document.querySelectorAll('.nav-link'), ...document.querySelectorAll('.mobile-nav-link')];
    const navHeight = document.querySelector('.navbar').offsetHeight;

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

            if (mobileMenu.classList.contains('open')) {
                mobileMenu.classList.remove('open');
            }
        }
    };
    
    allLinks.forEach(link => {
        if (link.getAttribute('href').startsWith('#')) {
            link.addEventListener('click', smoothScroll);
        }
    });

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

    const copyButtons = document.querySelectorAll('.contact-button[data-copy]');

    copyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const textToCopy = button.getAttribute('data-copy');
            const contactTextSpan = button.querySelector('.contact-text');
            const originalText = contactTextSpan.textContent;

            navigator.clipboard.writeText(textToCopy).then(() => {
                contactTextSpan.textContent = 'Copied!';
                button.classList.add('copied');
                
                setTimeout(() => {
                    contactTextSpan.textContent = originalText;
                    button.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
                contactTextSpan.textContent = 'Copy Failed';
                 setTimeout(() => {
                    contactTextSpan.textContent = originalText;
                }, 2000);
            });
        });
    });

    const contactForm = document.getElementById('contact-form');
    const formResult = document.getElementById('form-result');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            formResult.innerHTML = "Sending...";
            formResult.style.color = 'var(--text-muted)';

            fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: json
                })
                .then(async (response) => {
                    let jsonResponse = await response.json();
                    if (response.status == 200) {
                        formResult.innerHTML = "Message sent successfully!";
                        formResult.style.color = '#34d399';
                    } else {
                        console.log(response);
                        formResult.innerHTML = jsonResponse.message;
                        formResult.style.color = '#f87171';
                    }
                })
                .catch(error => {
                    console.log(error);
                    formResult.innerHTML = "Something went wrong!";
                    formResult.style.color = '#f87171';
                })
                .then(function() {
                    contactForm.reset();
                    setTimeout(() => {
                        formResult.innerHTML = '';
                    }, 5000);
                });
        });
    }
});