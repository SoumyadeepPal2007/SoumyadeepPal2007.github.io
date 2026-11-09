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
  initDocuments();
});

/* ==========================================================================
   1. Theme Switcher (Sophisticated Executive Palette: Light Default / Dark Toggle)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const storedTheme = localStorage.getItem('portfolio-theme');
  
  // Default to sophisticated light palette as requested, but respect explicit saved preference
  if (storedTheme) {
    document.documentElement.setAttribute('data-theme', storedTheme);
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
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

    // Prevent duplicate submission if already processing
    if (submitBtn.disabled) return;

    // Hide any previous alert messages
    hideAlerts();

    // Validate all 4 compulsory fields
    const nameInput = form.querySelector('input[name="name"]');
    const designationInput = form.querySelector('input[name="designation"]');
    const emailInput = form.querySelector('input[name="email"]');
    const messageInput = form.querySelector('textarea[name="message"]');

    if (!nameInput || !designationInput || !emailInput || !messageInput) return;

    const nameVal = nameInput.value.trim();
    const designationVal = designationInput.value.trim();
    const emailVal = emailInput.value.trim();
    const messageVal = messageInput.value.trim();

    if (!nameVal) {
      showError('Please enter your full name.');
      nameInput.focus();
      return;
    }

    if (!designationVal) {
      showError('Please enter your designation (e.g. Student, Recruiter, Developer, Professor).');
      designationInput.focus();
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal || !emailRegex.test(emailVal)) {
      showError('Please provide a valid personal email address.');
      emailInput.focus();
      return;
    }

    if (!messageVal || messageVal.length < 5) {
      showError('Please write your enquiry or message before sending (at least 5 characters).');
      messageInput.focus();
      return;
    }

    // Set loading state and lock button to prevent accidental multiple submissions
    setButtonLoading(true);

    try {
      // Real AJAX submission to FormSubmit endpoint with new recipient
      const formData = new FormData(form);

      const response = await fetch("https://formsubmit.co/ajax/soumyadeepp269@gmail.com", {
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
        const errNotice = result.message || 'Unable to submit the message through FormSubmit. If this is your first submission, please verify the one-time activation link sent to soumyadeepp269@gmail.com.';
        showError(errNotice);
      }
    } catch (error) {
      console.error('Contact Form Submission Error:', error);
      showError('A network error occurred while submitting your message. Please check your internet connection or email directly at soumyadeepp269@gmail.com.');
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

/* ==========================================================================
   7. Centralised Document Registry (SEE DOCUMENTS SECTION)
   --------------------------------------------------------------------------
   HOW TO ADD A NEW DOCUMENT IN THE FUTURE:
   1. Place your PDF file inside 'assets/documents/' (e.g. 'assets/documents/my_certificate.pdf')
   2. Simply add a new object to the 'documentsConfig' array below with:
      - title: 'Your Certificate / Document Title'
      - category: 'Category Name (e.g. Certificate, Research Paper, Notes)'
      - url: 'assets/documents/my_certificate.pdf' (or any external URL)
      - badge: 'Short Badge (e.g. Verified, PDF, Resource)'
      - viewText: 'Button Text (e.g. View Certificate)'
      - download: true / false
      - downloadFilename: 'Filename_When_Downloaded.pdf'
      - description: 'A short one-line description of the document.'
   ========================================================================== */
const documentsConfig = [
  {
    id: "doc-resume",
    title: "Official Resume / Curriculum Vitae",
    category: "Academic & Career Profile",
    url: "assets/documents/resume.pdf",
    badge: "Official Resume",
    viewText: "View Resume",
    download: true,
    downloadFilename: "Soumyadeep_Pal_Resume.pdf",
    description: "Official B.Tech IT resume highlighting core programming in C, C++, Java, and Python, academic credentials, and projects."
  },
  {
    id: "doc-linkedin-learning",
    title: "LinkedIn Learning Certificate",
    category: "Professional Credential",
    url: "https://www.linkedin.com/learning/certificates/7d6e94b18ee82e362d144f5b67ee6c1ce7f8a7d2237228a4e5adf5b0d4f4618e",
    badge: "Verified Certificate",
    viewText: "View Certificate",
    download: false,
    description: "Verified course completion certificate issued by LinkedIn Learning in professional software engineering methodologies."
  },
  {
    id: "doc-additional-learning",
    title: "Additional Learning Document",
    category: "Technical Study Material",
    url: "https://drive.google.com/file/d/1yL5rkivxjDsLRyGq8xV9we5BZuq6jC9n/view",
    badge: "Google Drive Resource",
    viewText: "View Document",
    download: false,
    description: "Supplementary technical study material, academic engineering notes, and learning resources shared via Google Drive."
  }
];

function initDocuments() {
  const container = document.getElementById('documents-grid');
  if (!container) return;

  container.innerHTML = documentsConfig.map(doc => {
    const downloadBtnHtml = doc.download
      ? `<a href="${doc.url}" download="${doc.downloadFilename || ''}" class="btn-download-doc" title="Download Document" aria-label="Download ${doc.title}">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
             <polyline points="7 10 12 15 17 10"></polyline>
             <line x1="12" y1="15" x2="12" y2="3"></line>
           </svg>
           <span>Download</span>
         </a>`
      : '';

    return `
      <article class="document-card reveal">
        <div class="document-header">
          <div class="document-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <span class="document-badge">${doc.badge}</span>
        </div>
        <div class="document-category">${doc.category}</div>
        <h3 class="document-title">${doc.title}</h3>
        <p class="document-desc">${doc.description}</p>
        <div class="document-actions">
          <a href="${doc.url}" target="_blank" rel="noopener noreferrer" class="btn-view-doc">
            <span>${doc.viewText || 'View Document'}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
          ${downloadBtnHtml}
        </div>
      </article>
    `;
  }).join('');
}

