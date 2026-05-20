
document.addEventListener('DOMContentLoaded', () => {

  const themeToggleBtn = document.getElementById('themeToggle');

  if (themeToggleBtn) {

    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
      document.body.classList.add('light-theme');
    }

    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');

      if (document.body.classList.contains('light-theme')) {
        localStorage.setItem('theme', 'light');
      } else {
        localStorage.setItem('theme', 'dark');
      }
    });
  }

  const header = document.querySelector('.header');
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  const handleScroll = () => {
    const scrollPos = window.scrollY;

    if (header) {
      if (scrollPos > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    if (scrollTopBtn) {
      if (scrollPos > 500) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll);

  handleScroll();

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');

      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  const sections = document.querySelectorAll('section[id]');

  const scrollspy = () => {
    const scrollPos = window.scrollY + 120; 

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        const activeLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);
        if (activeLink) {
          navLinks.forEach(link => link.classList.remove('active'));
          activeLink.classList.add('active');
        }
      }
    });
  };

  if (sections.length > 0) {
    window.addEventListener('scroll', scrollspy);
    scrollspy();
  }

  const typingElement = document.getElementById('typingText');
  if (typingElement) {
    const phrases = ["Front-End Engineer", "Vanilla JavaScript Enthusiast", "UI/UX Designer", "Creative Developer"];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const typeEffect = () => {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50; 
      } else {
        typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100; 
      }

      if (!isDeleting && charIndex === currentPhrase.length) {

        isDeleting = true;
        typingSpeed = 1500; 
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 500; 
      }

      setTimeout(typeEffect, typingSpeed);
    };

    setTimeout(typeEffect, 1000);
  }

  const progressFills = document.querySelectorAll('.skill-bar-fill');

  if (progressFills.length > 0) {
    const observerOptions = {
      root: null, 
      threshold: 0.1 
    };

    const skillsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fillElement = entry.target;
          const targetPercent = fillElement.getAttribute('data-percent');
          fillElement.style.width = `${targetPercent}%`;

          observer.unobserve(fillElement);
        }
      });
    }, observerOptions);

    progressFills.forEach(fill => {
      skillsObserver.observe(fill);
    });
  }

  const contactForm = document.getElementById('contactForm');
  const successModal = document.getElementById('successModal');
  const closeModalBtn = document.getElementById('closeModalBtn');

  if (contactForm) {
    const inputs = contactForm.querySelectorAll('.form-control');

    inputs.forEach(input => {
      input.addEventListener('input', () => {
        if (input.value.trim() !== '') {
          clearError(input);
        }
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault(); 

      let isFormValid = true;

      const nameInput = document.getElementById('userName');
      if (nameInput) {
        if (nameInput.value.trim() === '') {
          setError(nameInput, 'Name is required');
          isFormValid = false;
        } else if (nameInput.value.trim().length < 2) {
          setError(nameInput, 'Name must be at least 2 characters');
          isFormValid = false;
        } else {
          setSuccess(nameInput);
        }
      }

      const emailInput = document.getElementById('userEmail');
      if (emailInput) {
        const emailVal = emailInput.value.trim();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (emailVal === '') {
          setError(emailInput, 'Email is required');
          isFormValid = false;
        } else if (!emailRegex.test(emailVal)) {
          setError(emailInput, 'Please enter a valid email address');
          isFormValid = false;
        } else {
          setSuccess(emailInput);
        }
      }

      const messageInput = document.getElementById('userMessage');
      if (messageInput) {
        if (messageInput.value.trim() === '') {
          setError(messageInput, 'Message is required');
          isFormValid = false;
        } else if (messageInput.value.trim().length < 10) {
          setError(messageInput, 'Message must be at least 10 characters');
          isFormValid = false;
        } else {
          setSuccess(messageInput);
        }
      }

      if (isFormValid) {

        if (successModal) {
          successModal.classList.add('active');
          document.body.style.overflow = 'hidden'; 
        }

        contactForm.reset();
        inputs.forEach(input => {
          input.classList.remove('success');
        });
      }
    });
  }

  if (closeModalBtn && successModal) {
    closeModalBtn.addEventListener('click', () => {
      successModal.classList.remove('active');
      document.body.style.overflow = '';
    });

    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  function setError(input, message) {
    const group = input.parentElement;
    const errorText = group.querySelector('.error-txt');

    input.classList.remove('success');
    input.classList.add('error');
    group.classList.add('invalid');

    if (errorText) {
      errorText.textContent = message;
    }
  }

  function setSuccess(input) {
    const group = input.parentElement;

    input.classList.remove('error');
    input.classList.add('success');
    group.classList.remove('invalid');
  }

  function clearError(input) {
    const group = input.parentElement;

    input.classList.remove('error');
    group.classList.remove('invalid');
  }

  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {

        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const category = button.getAttribute('data-filter');

        projectCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');

          if (category === 'all' || cardCategory === category) {
            card.style.display = 'flex';

            card.style.opacity = '0';
            setTimeout(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity = '1';
            }, 50);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }
});
