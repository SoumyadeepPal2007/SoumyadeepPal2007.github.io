/**
 * Portfolio JavaScript - Soumyadeep Pal
 * Features:
 * - Theme Switcher (Dark/Light with localStorage persistence)
 * - Mobile Navigation Menu with smooth transitions
 * - Sticky Navbar with backdrop blur
 * - Active Navigation Link Highlighting on Scroll
 * - IntersectionObserver Scroll Reveal Animations
 * - Real FormSubmit Integration via AJAX with validation and feedback
 * - Copy Email to Clipboard with Toast Notification
 * - Smooth Back to Top Scroll
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initScrollEffects();
  initContactForm();
  initClipboard();
  initCopyrightYear();
});

/* ==========================================================================
   1. Theme Switcher (Dark / Light)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const storedTheme = localStorage.getItem('portfolio-theme');
  
  // Default to dark theme, but check if user saved a preference
  if (storedTheme) {
    document.documentElement.setAttribute('data-theme', storedTheme);
  } else {
    // Check system preference
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    if (prefersLight) {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
      
      // Update aria label for accessibility
      themeToggleBtn.setAttribute('aria-label', `Switch to ${currentTheme} theme`);
    });
  }
}

/* ==========================================================================
   2. Mobile Navigation & Link Handling
   ========================================================================== */
function initNavigation() {
  const mobileToggle = document.getElementById('mobile-toggle-btn');
  const navLinks = document.getElementById('nav-links');
  const navLinksItems = document.querySelectorAll('.nav-link');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close mobile menu when clicking any nav link
    navLinksItems.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close when clicking outside of nav menu on mobile
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && 
          !navLinks.contains(e.target) && 
          !mobileToggle.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  function openMobileMenu() {
    mobileToggle.classList.add('open');
    mobileToggle.setAttribute('aria-expanded', 'true');
    navLinks.classList.add('open');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  function closeMobileMenu() {
    mobileToggle.classList.remove('open');
    mobileToggle.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* ==========================================================================
   3. Scroll Effects & Section Spy (Active Nav Link)
   ========================================================================== */
function initScrollEffects() {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const revealElements = document.querySelectorAll('.reveal');

  // Sticky Navbar background on scroll
  const handleScroll = () => {
    if (window.scrollY > 30) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // Active section indicator using IntersectionObserver
  const sectionObserverOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, sectionObserverOptions);

  sections.forEach(sec => sectionObserver.observe(sec));

  // Scroll reveal animations
  const revealObserverOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Reveal once
      }
    });
  }, revealObserverOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  // Back to top button
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

/* ==========================================================================
   4. Contact Form Handling (FormSubmit Integration)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const alertSuccess = document.getElementById('form-alert-success');
  const alertError = document.getElementById('form-alert-error');
  const errorMessageText = document.getElementById('error-message-text');

  if (!form || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Hide any previous alert messages
    hideAlerts();

    // Validate inputs
    const emailInput = form.querySelector('input[name="email"]');
    const messageInput = form.querySelector('textarea[name="message"]');

    if (!emailInput || !messageInput) return;

    const emailVal = emailInput.value.trim();
    const messageVal = messageInput.value.trim();

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailVal)) {
      showError('Please provide a valid email address.');
      emailInput.focus();
      return;
    }

    if (messageVal.length < 5) {
      showError('Please write a slightly more detailed message before sending.');
      messageInput.focus();
      return;
    }

    // Set loading state on submit button
    setButtonLoading(true);

    try {
      // Real AJAX submission to FormSubmit endpoint
      const formData = new FormData(form);

      const response = await fetch("https://formsubmit.co/ajax/soumyadeepp830@gmail.com", {
        method: "POST",
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      });

      const result = await response.json();

      if (response.ok && (result.success === "true" || result.success === true)) {
        // Successful submission
        showSuccess('Thank you! Your message has been sent successfully to Soumyadeep. I will respond to your email as soon as possible.');
        form.reset();
      } else {
        // FormSubmit returned an error or requires initial verification
        const errNotice = result.message || 'Unable to submit the message through FormSubmit. If this is your first submission, please ensure the FormSubmit activation link in your email has been confirmed.';
        showError(errNotice);
      }
    } catch (error) {
      console.error('Contact Form Submission Error:', error);
      showError('A network error occurred while submitting your message. Please check your internet connection or email directly at soumyadeepp830@gmail.com.');
    } finally {
      setButtonLoading(false);
    }
  });

  function setButtonLoading(isLoading) {
    if (isLoading) {
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
    } else {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  }

  function showSuccess(message) {
    if (alertSuccess) {
      const msgElem = alertSuccess.querySelector('.alert-message');
      if (msgElem) msgElem.textContent = message;
      alertSuccess.style.display = 'flex';
      alertSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function showError(message) {
    if (alertError) {
      if (errorMessageText) errorMessageText.textContent = message;
      alertError.style.display = 'flex';
      alertError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function hideAlerts() {
    if (alertSuccess) alertSuccess.style.display = 'none';
    if (alertError) alertError.style.display = 'none';
  }
}

/* ==========================================================================
   5. Clipboard Copy with Toast
   ========================================================================== */
function initClipboard() {
  const copyButtons = document.querySelectorAll('[data-copy-text]');
  const toast = document.getElementById('toast-notification');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy-text');
      if (!textToCopy) return;

      try {
        await navigator.clipboard.writeText(textToCopy);
        showToast(`Copied "${textToCopy}" to clipboard!`);
      } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`Copied "${textToCopy}" to clipboard!`);
      }
    });
  });

  let toastTimeout;
  function showToast(message) {
    if (!toast) return;
    
    const toastText = toast.querySelector('.toast-text');
    if (toastText) toastText.textContent = message;
    
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }
}

/* ==========================================================================
   6. Dynamic Copyright Year
   ========================================================================== */
function initCopyrightYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

