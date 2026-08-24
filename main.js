document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('js-ready');

  // --- SCROLL REVEAL ANIMATIONS ---
  const revealGroups = [
    'section',
    '.timeline-item',
    '.education-item',
    '.skill-category',
    '.project-card',
    '.cert-card',
    '.contact-item',
    '.status-card',
    '.contact-form-container'
  ];

  const revealElements = document.querySelectorAll(revealGroups.join(', '));

  revealElements.forEach((element, index) => {
    const rowDelay = index % 6;
    element.classList.add('reveal');
    element.style.setProperty('--reveal-delay', `${rowDelay * 70}ms`);
  });

  document.querySelectorAll('.contact-info, .about-content').forEach(element => {
    element.classList.add('reveal-left');
  });

  document.querySelectorAll('.contact-form-container, .hero-avatar').forEach(element => {
    element.classList.add('reveal-right');
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -12% 0px',
    threshold: 0.12
  });

  revealElements.forEach(element => revealObserver.observe(element));
  document.querySelector('header')?.classList.add('reveal-visible');

  // --- HERO MICRO-PARALLAX ---
  const heroLayout = document.querySelector('.hero-layout');
  const heroAvatar = document.querySelector('.hero-avatar');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (heroLayout && heroAvatar && !prefersReducedMotion) {
    heroLayout.addEventListener('pointermove', (event) => {
      const bounds = heroLayout.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 10;
      const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 10;

      heroAvatar.style.setProperty('--tilt-x', `${x}px`);
      heroAvatar.style.setProperty('--tilt-y', `${y}px`);
    });

    heroLayout.addEventListener('pointerleave', () => {
      heroAvatar.style.setProperty('--tilt-x', '0px');
      heroAvatar.style.setProperty('--tilt-y', '0px');
    });
  }

  // --- TIMELINE SCROLL PROGRESS ---
  const timeline = document.querySelector('.timeline');

  function updateTimelineProgress() {
    if (!timeline) return;

    const rect = timeline.getBoundingClientRect();
    const viewportCenter = window.innerHeight * 0.58;
    const rawProgress = (viewportCenter - rect.top) / rect.height;
    const progress = Math.min(Math.max(rawProgress, 0), 1) * 100;

    timeline.style.setProperty('--timeline-progress', `${progress}%`);
  }

  updateTimelineProgress();
  window.addEventListener('scroll', updateTimelineProgress, { passive: true });
  window.addEventListener('resize', updateTimelineProgress);

  // --- FLOATING DOCK INTERACTIVE NAVIGATION ---
  const sections = document.querySelectorAll('section, header');
  const navItems = document.querySelectorAll('.dock-item[data-target]');
  
  // Smooth scroll click handler
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = item.getAttribute('data-target');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Calculate offset if header height exists, otherwise scroll directly
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Push target to active state immediately
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
      }
    });
  });

  // Track active section on scroll using IntersectionObserver
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -50% 0px', // Triggers when section occupies middle region of screen
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        const targetSelector = id === 'home' ? 'header' : `#${id}`;
        
        navItems.forEach(item => {
          if (item.getAttribute('data-target') === targetSelector) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    if (section.getAttribute('id')) {
      observer.observe(section);
    }
  });


  // --- LIGHT / DARK MODE TOGGLER ---
  const themeToggle = document.getElementById('theme-toggle');
  
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Switch inline SVGs for theme indicator
    if (theme === 'dark') {
      themeToggle.setAttribute('data-tooltip', 'Light Mode');
      themeToggle.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
        </svg>
      `;
    } else {
      themeToggle.setAttribute('data-tooltip', 'Dark Mode');
      themeToggle.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
        </svg>
      `;
    }
  }

  // Load saved theme or fall back to system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  setTheme(initialTheme);

  // Toggle button event listener
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  });


  // --- CONTACT FORM SUBMISSION WITH INTEGRATION READY DESIGN ---
  const contactForm = document.getElementById('contact-form');
  const formMessage = document.getElementById('form-message');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      // Reset status indicator
      formMessage.style.display = 'none';
      formMessage.className = 'form-message';
      
      // Set button to sending state
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      const actionUrl = contactForm.getAttribute('action');
      const formData = new FormData(contactForm);

      // Verify if there's a valid remote endpoint action set (non-empty, not pointing to placeholder)
      if (actionUrl && actionUrl.trim() !== '' && !actionUrl.includes('placeholder')) {
        try {
          const response = await fetch(actionUrl, {
            method: 'POST',
            body: formData,
            headers: {
              'Accept': 'application/json'
            }
          });

          if (response.ok) {
            displayStatus('Success! Your message was sent successfully. I will get back to you shortly.', 'success');
            contactForm.reset();
          } else {
            const data = await response.json();
            if (data && data.errors) {
              const errorsText = data.errors.map(err => err.message).join(', ');
              displayStatus(`Error: ${errorsText}`, 'error');
            } else {
              displayStatus('Oops! Something went wrong while submitting. Please try again.', 'error');
            }
          }
        } catch (error) {
          displayStatus('Error: Could not connect to the form server. Please check your network and try again.', 'error');
        } finally {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      } else {
        // Local simulation fallback
        setTimeout(() => {
          displayStatus('Success! (Simulation Mode) Your message was captured. Hook up a Formspree/Web3Forms URL to send actual emails.', 'success');
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }, 1200);
      }
    });
  }

  function displayStatus(msg, type) {
    formMessage.textContent = msg;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
  }
});
