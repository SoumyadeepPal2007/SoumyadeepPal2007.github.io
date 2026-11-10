/**
 * ============================================================
 *  Portfolio JavaScript — Soumyadeep Pal  |  v2.0
 * ============================================================
 *  Features:
 *   1.  Theme Switcher          (dark / light + localStorage)
 *   2.  Mode System             (normal / terminal / recruiter)
 *   3.  Mobile Navigation       (hamburger menu)
 *   4.  Scroll Effects          (IntersectionObserver + sticky nav)
 *   5.  Terminal Mode Engine    (full CLI with 15+ commands)
 *   6.  Project Analysis Modal  (per-project deep-dive overlay)
 *   7.  Video Modal             (intro video overlay)
 *   8.  Contact Options         (email panel / WhatsApp panel)
 *   9.  Contact Form            (FormSubmit AJAX — legacy 4-field)
 *  10.  Clipboard Copy          (copy email + toast notification)
 *  11.  Copyright Year          (auto-updates)
 *  12.  Documents Registry      (renders documentsConfig to grid)
 *  13.  Business Card Generator (Canvas download — no libraries)
 *  14.  Animated Name Greeting  (typing effect on hero name)
 * ============================================================
 */

'use strict';

/* ============================================================
   DOCUMENT READY — Entry Point
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initModeSystem();
  initNavigation();
  initScrollEffects();
  initContactOptions();   // new panel-based contact switcher
  initContactForm();      // legacy 4-field form (recruiter mode)
  initClipboard();
  initCopyrightYear();
  initDocuments();
  initVideoModal();
  initProjectModals();
  initNormalMode();
  // Terminal is initialized lazily when the user switches to it
});

/* ============================================================
   1. THEME SWITCHER
   - Reads/writes 'portfolio-theme' in localStorage
   - Toggles data-theme attribute on <html>
   ============================================================ */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const storedTheme    = localStorage.getItem('portfolio-theme');

  // Respect saved preference; default to 'light'
  document.documentElement.setAttribute('data-theme', storedTheme || 'light');

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next    = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('portfolio-theme', next);
      themeToggleBtn.setAttribute('aria-label', `Switch to ${current} theme`);
    });
  }
}

/* ============================================================
   2. MODE SYSTEM
   - Modes: 'normal' | 'terminal' | 'recruiter'
   - localStorage key: 'portfolio-mode'
   - Containers: #normal-mode, #terminal-mode, #recruiter-mode
   - Toggle buttons: .mode-btn[data-mode]
   ============================================================ */
let terminalInitialized = false; // lazy-init guard

function initModeSystem() {
  const savedMode  = localStorage.getItem('portfolio-mode') || 'normal';
  const modeBtns   = document.querySelectorAll('.mode-btn[data-mode]');

  // Apply saved / default mode on load
  applyMode(savedMode, false);

  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-mode');
      if (!target) return;
      applyMode(target, true);
      localStorage.setItem('portfolio-mode', target);
    });
  });
}

/**
 * Apply a portfolio mode.
 * @param {string}  mode       - 'normal' | 'terminal' | 'recruiter'
 * @param {boolean} animate    - whether to run a smooth transition
 */
function applyMode(mode, animate) {
  const containers = {
    normal:    document.getElementById('normal-mode'),
    terminal:  document.getElementById('terminal-mode'),
    recruiter: document.getElementById('recruiter-mode')
  };
  const modeBtns = document.querySelectorAll('.mode-btn[data-mode]');

  // Hide all containers
  Object.values(containers).forEach(el => {
    if (!el) return;
    if (animate) {
      el.style.transition = 'opacity 0.25s ease';
      el.style.opacity    = '0';
      setTimeout(() => { el.style.display = 'none'; el.style.opacity = ''; }, 250);
    } else {
      el.style.display = 'none';
    }
  });

  // Show the target container
  const target = containers[mode];
  if (target) {
    if (animate) {
      setTimeout(() => {
        target.style.display  = 'block';
        target.style.opacity  = '0';
        target.style.transition = 'opacity 0.3s ease';
        requestAnimationFrame(() => { target.style.opacity = '1'; });
      }, 260);
    } else {
      target.style.display = 'block';
    }
  }

  // Update active state on mode buttons
  modeBtns.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
  });

  // Lazy-initialize terminal on first switch
  if (mode === 'terminal' && !terminalInitialized) {
    // Slight delay to let the container become visible first
    setTimeout(() => { initTerminal(); terminalInitialized = true; }, animate ? 350 : 0);
  }
}

/* ============================================================
   3. MOBILE NAVIGATION
   - Hamburger button: #mobile-toggle-btn
   - Nav links container: #nav-links
   - Close on link click / outside click / Escape
   ============================================================ */
function initNavigation() {
  const mobileToggle = document.getElementById('mobile-toggle-btn');
  const navLinks     = document.getElementById('nav-links');
  const navLinkItems = document.querySelectorAll('.nav-link');

  if (!mobileToggle || !navLinks) return;

  mobileToggle.addEventListener('click', () => {
    navLinks.classList.contains('open') ? closeMenu() : openMenu();
  });

  navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
      const currentMode = localStorage.getItem('portfolio-mode') || 'normal';
      if (currentMode !== 'normal') {
        applyMode('normal', false);
        localStorage.setItem('portfolio-mode', 'normal');
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
          setTimeout(() => {
            const targetEl = document.querySelector(targetId);
            if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
          }, 80);
        }
      }
    });
  });

  document.addEventListener('click', e => {
    if (
      navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !mobileToggle.contains(e.target)
    ) closeMenu();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) closeMenu();
  });

  function openMenu() {
    mobileToggle.classList.add('open');
    mobileToggle.setAttribute('aria-expanded', 'true');
    navLinks.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileToggle.classList.remove('open');
    mobileToggle.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* ============================================================
   4. SCROLL EFFECTS
   - Sticky navbar background on scroll
   - Active nav-link highlighting via IntersectionObserver
   - Scroll-reveal for .reveal elements
   - Back-to-top button
   ============================================================ */
function initScrollEffects() {
  const navbar         = document.getElementById('navbar');
  const sections       = document.querySelectorAll('section[id]');
  const navLinks       = document.querySelectorAll('.nav-link');
  const revealElements = document.querySelectorAll('.reveal');

  // Sticky navbar shadow/backdrop
  const handleScroll = () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Active section spy
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    });
  }, { root: null, rootMargin: '-20% 0px -60% 0px', threshold: 0 });

  sections.forEach(sec => sectionObserver.observe(sec));

  // Scroll-reveal
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    });
  }, { root: null, rootMargin: '0px 0px -50px 0px', threshold: 0.1 });

  revealElements.forEach(el => revealObserver.observe(el));

  // Back-to-top
  const backToTopBtn = document.getElementById('back-to-top-btn');
  backToTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ============================================================
   5. TERMINAL MODE ENGINE
   ============================================================ */

/** Command definitions — single source of truth */
const TERMINAL_COMMANDS = {
  help: {
    desc: 'List all available commands',
    handler: cmdHelp
  },
  about: {
    desc: 'About Soumyadeep Pal',
    handler: cmdAbout
  },
  skills: {
    desc: 'View technical skills',
    handler: cmdSkills
  },
  projects: {
    desc: 'List all projects',
    handler: cmdProjects
  },
  education: {
    desc: 'Academic background',
    handler: cmdEducation
  },
  roadmap: {
    desc: 'Journey timeline (2018 → present)',
    handler: cmdRoadmap
  },
  achievements: {
    desc: 'Awards and academic achievements',
    handler: cmdAchievements
  },
  certifications: {
    desc: 'Certifications & credentials',
    handler: cmdCertifications
  },
  github: {
    desc: 'Open GitHub profile in new tab',
    handler: cmdGithub
  },
  linkedin: {
    desc: 'Open LinkedIn profile in new tab',
    handler: cmdLinkedin
  },
  youtube: {
    desc: 'Open YouTube channel in new tab',
    handler: cmdYoutube
  },
  resume: {
    desc: 'Open resume PDF in new tab',
    handler: cmdResume
  },
  contact: {
    desc: 'Show contact information',
    handler: cmdContact
  },
  documents: {
    desc: 'List available documents',
    handler: cmdDocuments
  },
  ai: {
    desc: 'AI tools, interests and prompt engineering',
    handler: cmdAi
  },
  clear: {
    desc: 'Clear terminal output',
    handler: cmdClear
  }
};

const TERMINAL_WELCOME = `
╔══════════════════════════════════════════════╗
║  SOUMYADEEP PAL - DEVELOPER TERMINAL v1.0   ║
║  Type 'help' to see available commands       ║
╚══════════════════════════════════════════════╝
`;

let terminalOutput;
let terminalInput;
const cmdHistory  = [];
let historyIndex  = -1;

function initTerminal() {
  terminalOutput = document.getElementById('terminal-output');
  terminalInput  = document.getElementById('terminal-input');

  if (!terminalOutput || !terminalInput) return;

  // Welcome banner
  appendTerminalLine(TERMINAL_WELCOME, 'terminal-welcome');

  // Enter key → execute command
  terminalInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const raw = terminalInput.value.trim();
      terminalInput.value = '';
      historyIndex = -1;
      if (!raw) return;
      cmdHistory.unshift(raw);
      if (cmdHistory.length > 50) cmdHistory.pop();
      executeTerminalCommand(raw);
    }

    // Up arrow — older history
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < cmdHistory.length - 1) {
        historyIndex++;
        terminalInput.value = cmdHistory[historyIndex] || '';
      }
    }

    // Down arrow — newer history
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        terminalInput.value = cmdHistory[historyIndex] || '';
      } else {
        historyIndex = -1;
        terminalInput.value = '';
      }
    }
  });

  // Command quick-buttons (.cmd-item[data-cmd])
  document.querySelectorAll('.cmd-item[data-cmd]').forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (!cmd) return;
      terminalInput.value = cmd;
      terminalInput.focus();
      executeTerminalCommand(cmd);
      terminalInput.value = '';
    });
  });

  // Auto-focus
  terminalInput.focus();
}

/** Execute a raw terminal command string */
function executeTerminalCommand(raw) {
  const lower = raw.toLowerCase().trim();

  // Echo the prompt line
  appendTerminalLine(`<span class="term-prompt">visitor@portfolio:~$</span> <span class="term-cmd-echo">${escapeHtml(raw)}</span>`, 'terminal-input-echo');

  const def = TERMINAL_COMMANDS[lower];
  if (def) {
    def.handler();
  } else {
    appendTerminalLine(
      `<span class="term-error">Command not found: '${escapeHtml(raw)}'</span>\n` +
      `<span class="term-hint">Type <span class="term-keyword">help</span> to see available commands.</span>`,
      'terminal-output-block'
    );
  }
  scrollTerminalToBottom();
}

/** Append a line / block to the terminal output */
function appendTerminalLine(html, className = 'terminal-output-block') {
  if (!terminalOutput) return;
  const div = document.createElement('div');
  div.className = className;
  div.innerHTML = html;
  terminalOutput.appendChild(div);
  scrollTerminalToBottom();
}

function scrollTerminalToBottom() {
  if (terminalOutput) terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

/** Escape HTML to prevent injection */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ---- Terminal Command Handlers ---- */

function cmdHelp() {
  const rows = Object.entries(TERMINAL_COMMANDS)
    .map(([name, def]) =>
      `  <span class="term-keyword">${name.padEnd(18)}</span><span class="term-muted">${def.desc}</span>`
    ).join('\n');
  appendTerminalLine(
    `<span class="term-section">AVAILABLE COMMANDS</span>\n${rows}`,
    'terminal-output-block'
  );
}

function cmdAbout() {
  appendTerminalLine(
    `<span class="term-section">ABOUT</span>\n` +
    `  Soumyadeep Pal | B.Tech IT Student @ IEM Kolkata\n` +
    `  Languages  : C, C++, Java, Python\n` +
    `  Interests  : DSA, Artificial Intelligence & Machine Learning\n` +
    `  Year       : Second Year (Batch 2025–2029)\n` +
    `  Location   : Kolkata, West Bengal, India`,
    'terminal-output-block'
  );
}

function cmdSkills() {
  appendTerminalLine(
    `<span class="term-section">TECHNICAL SKILLS</span>\n` +
    `  <span class="term-keyword">Languages   :</span> C, C++, Java, Python\n` +
    `  <span class="term-keyword">Web Dev     :</span> HTML5, CSS3, JavaScript\n` +
    `  <span class="term-keyword">AI / ML     :</span> Machine Learning, Deep Learning, Prompt Engineering\n` +
    `  <span class="term-keyword">Databases   :</span> MySQL, SQL\n` +
    `  <span class="term-keyword">Tools       :</span> Git, GitHub, VS Code, Linux CLI\n` +
    `  <span class="term-keyword">Concepts    :</span> Data Structures & Algorithms, OOP, DBMS\n` +
    `  <span class="term-keyword">Soft Skills :</span> Problem Solving, Team Collaboration, Communication`,
    'terminal-output-block'
  );
}

function cmdProjects() {
  appendTerminalLine(
    `<span class="term-section">PROJECTS</span>\n` +
    `  <span class="term-keyword">1. CropSense AI</span>          — AI-powered crop disease detection & soil health platform (Vercel)\n` +
    `  <span class="term-keyword">2. EduPilot AI</span>           — Collaborative AI educational platform with smart curriculum guidance\n` +
    `  <span class="term-keyword">3. EventIQ</span>               — Responsive event management website with live scheduling\n` +
    `  <span class="term-keyword">4. Smart Factory Dashboard</span>— Real-time OEE / telemetry dashboard for smart manufacturing\n` +
    `  <span class="term-keyword">5. WallBot</span>               — Autonomous wall-climbing painting robot (Python + C + IoT)\n` +
    `  <span class="term-keyword">6. Train Reservation System</span>— PNR-based deterministic berth allocation engine (C + Python + MySQL)\n\n` +
    `  <span class="term-hint">Tip: scroll to the Projects section for full details & demos.</span>`,
    'terminal-output-block'
  );
}

function cmdEducation() {
  appendTerminalLine(
    `<span class="term-section">EDUCATION</span>\n` +
    `  <span class="term-keyword">Degree   :</span> B.Tech — Information Technology\n` +
    `  <span class="term-keyword">Institute:</span> Institute of Engineering & Management (IEM), Kolkata\n` +
    `  <span class="term-keyword">Year     :</span> Second Year | Batch 2025–2029\n` +
    `  <span class="term-keyword">Subjects :</span> DSA, DBMS, OS, COA, OOP, Discrete Math`,
    'terminal-output-block'
  );
}

function cmdRoadmap() {
  appendTerminalLine(
    `<span class="term-section">MY LEARNING JOURNEY</span>\n\n` +
    `  <span class="term-keyword">2018–2020:</span> <span class="term-highlight">HTML Basics</span>\n` +
    `             Introduction to web development.\n\n` +
    `  <span class="term-keyword">2020–2023:</span> <span class="term-highlight">Class 10 – ICSE</span>\n` +
    `             Introduction to Programming using Java. Learned Java fundamentals.\n\n` +
    `  <span class="term-keyword">2023–2025:</span> <span class="term-highlight">Python Programming</span>\n` +
    `             Studied Python in detail under CBSE curriculum.\n\n` +
    `  <span class="term-keyword">2023–2025:</span> <span class="term-highlight">Networking and DBMS</span>\n` +
    `             • Networking Basics\n` +
    `             • Database Management Systems\n` +
    `             • MySQL\n` +
    `             • Fundamentals of Data Structures\n\n` +
    `  <span class="term-keyword">2025–2026:</span> <span class="term-highlight">C Programming & AI / Data Science</span>\n` +
    `             Introduction to C Programming.\n` +
    `             Introduction to AI and Data Science using Python (NumPy, Pandas, Matplotlib).\n` +
    `             Personal Learning: C++ Programming.\n\n` +
    `  <span class="term-keyword">2026–ONGOING:</span> <span class="term-highlight">DSA & Intelligent Systems</span>\n` +
    `             Currently Learning: Data Structures and Algorithms using C/C++.\n` +
    `             Additional Learning Interests:\n` +
    `             • Artificial Intelligence\n` +
    `             • Machine Learning\n` +
    `             • Prompt Engineering`,
    'terminal-output-block'
  );
}

function cmdAchievements() {
  appendTerminalLine(
    `<span class="term-section">ACHIEVEMENTS</span>\n` +
    `  <span class="term-keyword">🏅 NPTEL Elite + Silver</span>  — Top 5% nationally in NPTEL examination\n` +
    `  <span class="term-keyword">🤝 Hackathon Participation</span>— Active participant in competitive tech hackathons & rapid prototyping\n` +
    `  <span class="term-keyword">📘 Academic Excellence</span>   — Consistent strong academic standing at IEM Kolkata\n` +
    `  <span class="term-keyword">🌐 Open Source Contributor</span>— Multiple public repositories on GitHub`,
    'terminal-output-block'
  );
}

function cmdCertifications() {
  appendTerminalLine(
    `<span class="term-section">CERTIFICATIONS & CREDENTIALS</span>\n` +
    `  <span class="term-keyword">1. NPTEL Elite + Silver</span>   — Top 5% nationally (IIT certified)\n` +
    `  <span class="term-keyword">2. Academic Certificate</span>  — Verified academic credential (Google Drive)\n` +
    `  <span class="term-keyword">3. Learning Documents</span>     — Technical notes & engineering resources (Google Drive)\n` +
    `  <span class="term-keyword">4. LinkedIn Learning</span>     — Verified engineering course certificate\n\n` +
    `  <span class="term-hint">Type <span class="term-keyword">documents</span> to view and open direct URLs.</span>`,
    'terminal-output-block'
  );
}

function cmdGithub() {
  appendTerminalLine(
    `<span class="term-success">Opening GitHub profile…</span>\n  <span class="term-muted">https://github.com/SoumyadeepPal2007</span>`,
    'terminal-output-block'
  );
  window.open('https://github.com/SoumyadeepPal2007', '_blank', 'noopener,noreferrer');
}

function cmdLinkedin() {
  appendTerminalLine(
    `<span class="term-success">Opening LinkedIn profile…</span>\n  <span class="term-muted">https://www.linkedin.com/in/soumyadeep-pal-885140361/</span>`,
    'terminal-output-block'
  );
  window.open('https://www.linkedin.com/in/soumyadeep-pal-885140361/', '_blank', 'noopener,noreferrer');
}

function cmdYoutube() {
  appendTerminalLine(
    `<span class="term-success">Opening YouTube channel…</span>\n  <span class="term-muted">https://youtube.com/@soumyadeeppal7733</span>`,
    'terminal-output-block'
  );
  window.open('https://youtube.com/@soumyadeeppal7733', '_blank', 'noopener,noreferrer');
}

function cmdResume() {
  appendTerminalLine(
    `<span class="term-success">Opening resume PDF…</span>\n  <span class="term-muted">assets/documents/resume.pdf</span>`,
    'terminal-output-block'
  );
  window.open('assets/documents/resume.pdf', '_blank', 'noopener,noreferrer');
}

function cmdContact() {
  appendTerminalLine(
    `<span class="term-section">CONTACT</span>\n` +
    `  <span class="term-keyword">Email    :</span> soumyadeepp269@gmail.com\n` +
    `  <span class="term-keyword">WhatsApp :</span> +91 6291067449\n` +
    `  <span class="term-keyword">GitHub   :</span> github.com/SoumyadeepPal2007\n` +
    `  <span class="term-keyword">LinkedIn :</span> linkedin.com/in/soumyadeep-pal-885140361`,
    'terminal-output-block'
  );
}

function cmdDocuments() {
  const lines = documentsConfig.map((doc, i) =>
    `  <span class="term-keyword">${String(i + 1)}. ${doc.title}</span>\n` +
    `     Category : ${doc.category}\n` +
    `     Badge    : ${doc.badge}\n` +
    `     URL      : ${doc.url}`
  ).join('\n');
  appendTerminalLine(`<span class="term-section">DOCUMENTS (${documentsConfig.length})</span>\n${lines}`, 'terminal-output-block');
}

function cmdAi() {
  appendTerminalLine(
    `<span class="term-section">AI & PROMPT ENGINEERING</span>\n` +
    `  <span class="term-keyword">Interests  :</span> Machine Learning, Deep Learning, Computer Vision, NLP\n` +
    `  <span class="term-keyword">Tools Used :</span> Google Gemini, ChatGPT, GitHub Copilot, Perplexity AI\n` +
    `  <span class="term-keyword">Skills     :</span> Prompt Engineering, AI Model Integration, REST APIs for ML\n` +
    `  <span class="term-keyword">Projects   :</span> CropSense AI (crop disease detection), EduPilot AI (educational AI)\n` +
    `                 Smart Factory Dashboard (AI-assisted analytics)\n` +
    `  <span class="term-keyword">Goal       :</span> Build responsible, scalable AI solutions with real-world impact`,
    'terminal-output-block'
  );
}

function cmdClear() {
  if (terminalOutput) terminalOutput.innerHTML = '';
}

/* ============================================================
   6. PROJECT ANALYSIS MODAL
   ============================================================ */

const projectsData = {
  cropsense: {
    title:        'CropSense AI',
    problem:      'Farmers lack accessible, data-driven tools to identify crop diseases, assess soil health, and receive region-specific agricultural recommendations.',
    overview:     'An AI-driven agricultural platform focused on helping users with crop-related insights, soil health analysis, disease identification, and smart crop recommendations for sustainable farming. Deployed on Vercel.',
    tech:         ['Python', 'Artificial Intelligence', 'Machine Learning', 'Web Deployment', 'Vercel'],
    contribution: 'Collaborative project. Contributed to AI model integration, frontend design, and deployment pipeline setup.',
    challenges:   'Integrating AI models with the web interface and ensuring accurate crop disease identification across diverse datasets.',
    solutions:    'Used pre-trained machine learning models with a clean REST interface. Deployed on Vercel for scalability.',
    demo:         'https://cropsense-ai-1-g1mumq933-roysubhasistech-7470s-projects.vercel.app/',
    github:       null
  },
  edupilot: {
    title:        'EduPilot AI',
    problem:      'Students struggle with personalized learning paths and intelligent academic guidance in traditional education platforms.',
    overview:     'A collaborative AI-powered educational web platform designed to streamline student learning journeys, offer interactive curriculum navigation, and assist learners with intelligent academic guidance.',
    tech:         ['Collaborative', 'Artificial Intelligence', 'JavaScript', 'Web Development', 'Vercel'],
    contribution: 'Collaborative project. Participated in frontend development, UI design, and AI feature integration.',
    challenges:   'Designing an intuitive UI that adapts to different learning styles and integrating AI recommendations seamlessly.',
    solutions:    'Implemented a component-based frontend with AI recommendation modules deployed on Vercel.',
    demo:         'https://edupilot-ai-tau.vercel.app/',
    github:       'https://github.com/SubhasisRoy578/EduPilot-AI'
  },
  eventiq: {
    title:        'EventIQ: Event Management Website',
    problem:      'Manual event management processes are time-consuming and error-prone, lacking efficient digital coordination tools.',
    overview:     'A modern and responsive web platform built for seamless event coordination, attendee registrations, and live scheduling with interactive ticket tracking.',
    tech:         ['HTML5', 'CSS3', 'JavaScript', 'UI/UX Design', 'DOM Manipulation'],
    contribution: 'Primary developer. Designed and built the complete frontend with event management features.',
    challenges:   'Creating a responsive, dynamic interface that handles event data without a backend.',
    solutions:    'Used vanilla JavaScript for DOM manipulation, localStorage for data persistence, and CSS Grid for responsive layouts.',
    demo:         null,
    github:       'https://github.com/SoumyadeepPal2007/EventIQ'
  },
  smartfactory: {
    title:        'Smart Factory Dashboard',
    problem:      'Industrial facilities lack real-time monitoring dashboards for tracking equipment effectiveness and sensor data.',
    overview:     'A real-time telemetry dashboard for smart manufacturing environments monitoring OEE, temperatures, and operational uptime.',
    tech:         ['JavaScript', 'CSS3', 'MySQL', 'Python', 'Data Visualization'],
    contribution: 'Led dashboard design, data visualization implementation, and database integration.',
    challenges:   'Presenting complex industrial data in an intuitive, real-time visual format.',
    solutions:    'Implemented interactive charts and gauges with Python data processing backend and MySQL for data storage.',
    demo:         null,
    github:       'https://github.com/SoumyadeepPal2007/smart-factory-dashboard'
  },
  wallbot: {
    title:        'WallBot: Wall Climbing Painting Robot',
    problem:      'High-altitude manual painting is dangerous and inefficient, requiring safer automated alternatives.',
    overview:     'An innovative climbing robot that adheres to vertical surfaces and applies uniform paint coatings, automating hazardous painting tasks.',
    tech:         ['Python', 'C', 'Robotics', 'IoT Hardware', 'Embedded Control'],
    contribution: 'Contributed to robot control system programming and sensor integration.',
    challenges:   'Maintaining surface adhesion on vertical walls while navigating and painting uniformly.',
    solutions:    'Used suction-based adhesion mechanism with servo-controlled movement and Python-based trajectory planning.',
    demo:         null,
    github:       'https://github.com/SoumyadeepPal2007/WallBot'
  },
  trainreservation: {
    title:        'Train Reservation System',
    problem:      'Traditional paper-based train reservation systems are slow, error-prone, and unable to handle concurrent booking requests efficiently.',
    overview:     'A dependable reservation engine delivering deterministic passenger berth allocations, route scheduling, and unique PNR transaction management.',
    tech:         ['C', 'Python', 'MySQL', 'Relational Schemas', 'Data Structures'],
    contribution: 'Designed database schema, implemented reservation logic, and built the transaction management system.',
    challenges:   'Handling concurrent reservations and ensuring data integrity across multiple booking transactions.',
    solutions:    'Implemented transaction-based MySQL operations with C for core processing and Python for the user interface layer.',
    demo:         null,
    github:       'https://github.com/SoumyadeepPal2007/train-reservation-system'
  }
};

/** Call from HTML: onclick="openProjectModal('cropsense')" */
function openProjectModal(key) {
  const data    = projectsData[key];
  const overlay = document.getElementById('project-modal-overlay');
  if (!data || !overlay) return;

  // Build tech tags
  const techHtml = data.tech.map(t => `<span class="modal-tech-tag">${escapeHtml(t)}</span>`).join('');

  // Build action buttons
  const demoBtn   = data.demo
    ? `<a href="${data.demo}" target="_blank" rel="noopener noreferrer" class="btn-modal-action btn-modal-demo">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
           <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
           <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
         </svg> Live Demo
       </a>` : '';
  const githubBtn = data.github
    ? `<a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn-modal-action btn-modal-github">
         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
           <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483
                    0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466
                    -.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832
                    .092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688
                    -.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844
                    c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651
                    .64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855
                    0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017
                    C22 6.484 17.522 2 12 2z"/>
         </svg> View Code
       </a>` : '';

  // Build Live Demo & GitHub display
  const demoDisplay = data.demo
    ? `<a href="${data.demo}" target="_blank" rel="noopener noreferrer" class="modal-link-highlight">
         ${escapeHtml(data.demo)}
         <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
           <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
         </svg>
       </a>`
    : `<span class="modal-placeholder-text">[Editable Placeholder: Live demo available on request or deployment in progress]</span>`;

  const githubDisplay = data.github
    ? `<a href="${data.github}" target="_blank" rel="noopener noreferrer" class="modal-link-highlight">
         ${escapeHtml(data.github)}
         <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
           <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
         </svg>
       </a>`
    : `<span class="modal-placeholder-text">[Editable Placeholder: Repository link being curated or available in private collaboration]</span>`;

  overlay.innerHTML = `
    <div class="project-modal" role="dialog" aria-modal="true" aria-label="${escapeHtml(data.title)}">
      <button class="modal-close-btn" onclick="closeProjectModal()" aria-label="Close modal">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      <div class="modal-header">
        <span class="project-modal-badge">Detailed Project Analysis</span>
        <h2 class="modal-title">${escapeHtml(data.title)}</h2>
      </div>

      <div class="modal-body">
        <div class="modal-section">
          <h3 class="modal-section-title">1. Project Title</h3>
          <p class="modal-section-text"><strong>${escapeHtml(data.title)}</strong></p>
        </div>
        <div class="modal-section">
          <h3 class="modal-section-title">2. Problem Statement</h3>
          <p class="modal-section-text">${escapeHtml(data.problem)}</p>
        </div>
        <div class="modal-section">
          <h3 class="modal-section-title">3. Project Overview</h3>
          <p class="modal-section-text">${escapeHtml(data.overview)}</p>
        </div>
        <div class="modal-section">
          <h3 class="modal-section-title">4. Technology Used</h3>
          <div class="modal-tech-stack" style="margin-top:0.5rem;">${techHtml}</div>
        </div>
        <div class="modal-section">
          <h3 class="modal-section-title">5. My Contribution / Role</h3>
          <p class="modal-section-text">${escapeHtml(data.contribution)}</p>
        </div>
        <div class="modal-section">
          <h3 class="modal-section-title">6. Challenges Faced</h3>
          <p class="modal-section-text">${escapeHtml(data.challenges)}</p>
        </div>
        <div class="modal-section">
          <h3 class="modal-section-title">7. Solutions and Implementation</h3>
          <p class="modal-section-text">${escapeHtml(data.solutions)}</p>
        </div>
        <div class="modal-section">
          <h3 class="modal-section-title">8. Live Demo</h3>
          <p class="modal-section-text">${demoDisplay}</p>
        </div>
        <div class="modal-section">
          <h3 class="modal-section-title">9. GitHub Repository</h3>
          <p class="modal-section-text">${githubDisplay}</p>
        </div>
      </div>

      <div class="modal-footer">
        ${demoBtn}
        ${githubBtn}
        <button class="btn-modal-action btn-modal-close" onclick="closeProjectModal()">Close Analysis</button>
      </div>
    </div>
  `;

  overlay.style.display = 'flex';
  requestAnimationFrame(() => overlay.classList.add('open'));
  document.body.style.overflow = 'hidden';

  // Click outside modal panel → close
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeProjectModal();
  }, { once: true });
}

function closeProjectModal() {
  const overlay = document.getElementById('project-modal-overlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  setTimeout(() => { overlay.style.display = 'none'; }, 280);
  document.body.style.overflow = '';
}

function initProjectModals() {
  // ESC key closes project modal
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const overlay = document.getElementById('project-modal-overlay');
      if (overlay && overlay.classList.contains('open')) closeProjectModal();
    }
  });
}

/* ============================================================
   7. VIDEO MODAL
   - Overlay: #video-modal-overlay
   - Video element: #intro-video
   - Open triggers: .video-trigger-btn
   - Close: .video-modal-close | click overlay | ESC
   ============================================================ */
function initVideoModal() {
  const overlay    = document.getElementById('video-modal-overlay');
  const video      = document.getElementById('intro-video');
  const triggerBtns = document.querySelectorAll('.video-trigger-btn');
  const closeBtn   = document.querySelector('.video-modal-close');

  if (!overlay || !video) return;

  function openVideoModal() {
    overlay.style.display = 'flex';
    requestAnimationFrame(() => overlay.classList.add('open'));
    document.body.style.overflow = 'hidden';
    video.currentTime = 0;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
  }

  function closeVideoModal() {
    video.pause();
    overlay.classList.remove('open');
    setTimeout(() => { overlay.style.display = 'none'; }, 280);
    document.body.style.overflow = '';
  }

  triggerBtns.forEach(btn => btn.addEventListener('click', openVideoModal));
  closeBtn?.addEventListener('click', closeVideoModal);

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeVideoModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeVideoModal();
  });
}

/* ============================================================
   8. CONTACT OPTIONS (Panel Switcher)
   - .contact-option-btn.email-btn   → shows .email-form-panel
   - .contact-option-btn.whatsapp-btn → shows .whatsapp-panel
   - Email form: #email-contact-form via FormSubmit AJAX
   ============================================================ */
function initContactOptions() {
  const emailBtn      = document.querySelector('.contact-option-btn.email-btn');
  const whatsappBtn   = document.querySelector('.contact-option-btn.whatsapp-btn');
  const emailPanel    = document.querySelector('.email-form-panel');
  const whatsappPanel = document.querySelector('.whatsapp-panel');
  const emailForm     = document.getElementById('email-contact-form');

  function showPanel(show, hide, activeBtn, inactiveBtn) {
    if (show)       { show.style.display = 'block'; }
    if (hide)       { hide.style.display = 'none'; }
    activeBtn?.classList.add('active');
    inactiveBtn?.classList.remove('active');
  }

  emailBtn?.addEventListener('click', () => {
    showPanel(emailPanel, whatsappPanel, emailBtn, whatsappBtn);
  });

  whatsappBtn?.addEventListener('click', () => {
    showPanel(whatsappPanel, emailPanel, whatsappBtn, emailBtn);
  });

  // ---- Email form AJAX (2-field: email + message) ----
  if (!emailForm) return;

  const successAlert = emailForm.querySelector('.contact-success-alert');
  const errorAlert   = emailForm.querySelector('.contact-error-alert');
  const submitBtn    = emailForm.querySelector('[type="submit"]');

  emailForm.addEventListener('submit', async e => {
    e.preventDefault();
    if (submitBtn?.disabled) return;

    hideContactAlerts();

    const emailInput   = emailForm.querySelector('input[name="email"]');
    const messageInput = emailForm.querySelector('textarea[name="message"]');

    const emailVal   = emailInput?.value.trim() || '';
    const messageVal = messageInput?.value.trim() || '';

    // Basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal || !emailRegex.test(emailVal)) {
      showContactAlert(errorAlert, 'Please enter a valid email address.');
      emailInput?.focus();
      return;
    }
    if (!messageVal || messageVal.length < 5) {
      showContactAlert(errorAlert, 'Please write a message (at least 5 characters).');
      messageInput?.focus();
      return;
    }

    // Set loading state
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }

    try {
      const formData = new FormData();
      formData.append('email',    emailVal);
      formData.append('_replyto', emailVal);
      formData.append('message',  messageVal);
      formData.append('_subject', 'Portfolio Contact - Soumyadeep Pal');

      const response = await fetch('https://formsubmit.co/ajax/soumyadeepp269@gmail.com', {
        method:  'POST',
        headers: { 'Accept': 'application/json' },
        body:    formData
      });

      const result = await response.json();

      if (response.ok && (result.success === 'true' || result.success === true)) {
        showContactAlert(successAlert, '✅ Message sent! Soumyadeep will reply to your email soon.');
        emailForm.reset();
      } else {
        showContactAlert(errorAlert, result.message || 'Could not send message. Please try directly at soumyadeepp269@gmail.com.');
      }
    } catch (err) {
      console.error('Contact Options Form Error:', err);
      showContactAlert(errorAlert, 'Network error. Please email directly: soumyadeepp269@gmail.com');
    } finally {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send Message'; }
    }
  });

  function showContactAlert(el, message) {
    if (!el) return;
    el.textContent = message;
    el.style.display = 'block';
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function hideContactAlerts() {
    if (successAlert) successAlert.style.display = 'none';
    if (errorAlert)   errorAlert.style.display   = 'none';
  }
}

/* ============================================================
   9. CONTACT FORM — LEGACY 4-FIELD (Recruiter Mode)
   - Form: #portfolio-contact-form
   - Fields: name, designation, email, message
   - Action: FormSubmit AJAX → soumyadeepp269@gmail.com
   ============================================================ */
function initContactForm() {
  const form            = document.getElementById('portfolio-contact-form');
  const submitBtn       = document.getElementById('submit-btn');
  const alertSuccess    = document.getElementById('form-alert-success');
  const alertError      = document.getElementById('form-alert-error');
  const errorMessageTxt = document.getElementById('error-message-text');

  if (!form || !submitBtn) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (submitBtn.disabled) return;

    hideAlerts();

    const nameInput        = form.querySelector('input[name="name"]');
    const designationInput = form.querySelector('input[name="designation"]');
    const emailInput       = form.querySelector('input[name="email"]');
    const messageInput     = form.querySelector('textarea[name="message"]');

    if (!nameInput || !designationInput || !emailInput || !messageInput) return;

    const nameVal        = nameInput.value.trim();
    const designationVal = designationInput.value.trim();
    const emailVal       = emailInput.value.trim();
    const messageVal     = messageInput.value.trim();

    if (!nameVal) {
      showError('Please enter your full name.');
      nameInput.focus(); return;
    }
    if (!designationVal) {
      showError('Please enter your designation (e.g. Student, Recruiter, Developer, Professor).');
      designationInput.focus(); return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal || !emailRegex.test(emailVal)) {
      showError('Please provide a valid email address.');
      emailInput.focus(); return;
    }
    if (!messageVal || messageVal.length < 5) {
      showError('Please write your message (at least 5 characters).');
      messageInput.focus(); return;
    }

    setLoading(true);

    try {
      const formData = new FormData(form);
      const response = await fetch('https://formsubmit.co/ajax/soumyadeepp269@gmail.com', {
        method:  'POST',
        headers: { 'Accept': 'application/json' },
        body:    formData
      });
      const result = await response.json();

      if (response.ok && (result.success === 'true' || result.success === true)) {
        showSuccess('Thank you! Your message has been sent. Soumyadeep will respond soon.');
        form.reset();
      } else {
        showError(result.message || 'Submission failed. Please verify FormSubmit activation or email directly.');
      }
    } catch (err) {
      console.error('Contact Form Error:', err);
      showError('Network error. Please email: soumyadeepp269@gmail.com');
    } finally {
      setLoading(false);
    }
  });

  function setLoading(on) {
    submitBtn.disabled = on;
    submitBtn.classList.toggle('loading', on);
  }
  function showSuccess(msg) {
    if (!alertSuccess) return;
    const msgEl = alertSuccess.querySelector('.alert-message');
    if (msgEl) msgEl.textContent = msg;
    alertSuccess.style.display = 'flex';
    alertSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  function showError(msg) {
    if (!alertError) return;
    if (errorMessageTxt) errorMessageTxt.textContent = msg;
    alertError.style.display = 'flex';
    alertError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  function hideAlerts() {
    if (alertSuccess) alertSuccess.style.display = 'none';
    if (alertError)   alertError.style.display   = 'none';
  }
}

/* ============================================================
   10. CLIPBOARD COPY WITH TOAST
   - Elements with [data-copy-text] attribute
   - Toast notification: #toast-notification
   ============================================================ */
function initClipboard() {
  const copyBtns = document.querySelectorAll('[data-copy-text]');
  const toast    = document.getElementById('toast-notification');
  let toastTimer;

  copyBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.getAttribute('data-copy-text');
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        // Fallback for older / restricted contexts
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      showToast(`Copied "${text}" to clipboard!`);
    });
  });

  function showToast(message) {
    if (!toast) return;
    const textEl = toast.querySelector('.toast-text');
    if (textEl) textEl.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
  }
}

/* ============================================================
   11. COPYRIGHT YEAR
   ============================================================ */
function initCopyrightYear() {
  const el = document.getElementById('current-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ============================================================
   12. DOCUMENTS REGISTRY
   ============================================================
   HOW TO ADD A NEW DOCUMENT:
   1. Place PDF in assets/documents/ (or use an external URL).
   2. Add an object to documentsConfig below.
   ============================================================ */

const documentsConfig = [
  {
    id:               'doc-resume',
    title:            'Official Resume / CV',
    type:             'pdf',
    category:         'Career & Academic Profile',
    url:              'assets/documents/resume.pdf',
    badge:            'Official Resume',
    typeLabel:        'PDF Document',
    viewText:         'View Resume',
    download:         true,
    downloadFilename: 'Soumyadeep_Pal_Resume.pdf',
    description:      'B.Tech IT resume featuring core programming in C, C++, Java, and Python, academic credentials, and software projects.'
  },
  {
    id:          'doc-gdrive-1',
    title:       'Academic Certificate & Credential',
    type:        'pdf',
    category:    'Professional Credential',
    url:         'https://drive.google.com/file/d/1z5sRYVvPSONdIKxJpqfLgsGxAOKPvBKY/view?usp=drivesdk',
    badge:       'Google Drive',
    typeLabel:   'PDF Document',
    viewText:    'View on Google Drive',
    download:    false,
    description: 'Verified academic certificate and credential document hosted on Google Drive.'
  },
  {
    id:          'doc-gdrive-2',
    title:       'Additional Learning & Technical Material',
    type:        'link',
    category:    'Technical Study Material',
    url:         'https://drive.google.com/file/d/1yL5rkivxjDsLRyGq8xV9weBZuq6jC9n/view?usp=drivesdk',
    badge:       'Google Drive',
    typeLabel:   'External Link',
    viewText:    'View on Google Drive',
    download:    false,
    description: 'Supplementary technical study material, academic engineering notes, and resources.'
  },
  {
    id:          'doc-linkedin-cert',
    title:       'LinkedIn Learning Verified Certificate',
    type:        'image',
    category:    'Professional Credential',
    url:         'https://www.linkedin.com/learning/certificates/7d6e94b18ee82e362d144f5b67ee6c1ce7f8a7d2237228a4e5adf5b0d4f4618e',
    badge:       'Verified Certificate',
    typeLabel:   'Image / Certificate',
    viewText:    'View Certificate',
    download:    false,
    description: 'Verified course completion credential issued by LinkedIn Learning in engineering methodologies.'
  }
];

function initDocuments() {
  const container = document.getElementById('documents-grid');
  if (!container) return;

  function getDocumentIcon(type) {
    if (type === 'image') {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>`;
    }
    if (type === 'link') {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>`;
    }
    // Default PDF icon
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>`;
  }

  container.innerHTML = documentsConfig.map(doc => {
    const downloadHtml = doc.download
      ? `<a href="${doc.url}" download="${doc.downloadFilename || ''}"
            class="btn-download-doc" title="Download Document" aria-label="Download ${doc.title}">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
             <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
             <polyline points="7 10 12 15 17 10"/>
             <line x1="12" y1="15" x2="12" y2="3"/>
           </svg>
           <span>Download</span>
         </a>` : '';

    return `
      <article class="document-card reveal doc-type-${doc.type}" id="${doc.id}">
        <div class="document-header">
          <div class="document-icon">
            ${getDocumentIcon(doc.type)}
          </div>
          <div style="display:flex;gap:0.4rem;align-items:center;">
            <span class="document-type-tag">${doc.typeLabel || doc.type.toUpperCase()}</span>
            <span class="document-badge">${doc.badge}</span>
          </div>
        </div>
        <div class="document-category">${doc.category}</div>
        <h3 class="document-title">${doc.title}</h3>
        <p class="document-desc">${doc.description}</p>
        <div class="document-actions">
          <a href="${doc.url}" target="_blank" rel="noopener noreferrer" class="btn-view-doc">
            <span>${doc.viewText || 'View Document'}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                 fill="none" stroke="currentColor" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
          ${downloadHtml}
        </div>
      </article>
    `;
  }).join('');
}

/* ============================================================
   13. BUSINESS CARD GENERATOR (Canvas — High Resolution with Genuine QR Code)
   ============================================================ */

/** Generate a valid 29x29 QR Code matrix for URLs up to 53 chars */
function generateQrMatrix(text) {
  const N = 29;
  const matrix = Array.from({ length: N }, () => Array(N).fill(null));

  function setFinder(r, c) {
    for (let i = -1; i <= 7; i++) {
      for (let j = -1; j <= 7; j++) {
        const row = r + i, col = c + j;
        if (row < 0 || row >= N || col < 0 || col >= N) continue;
        if (i >= 0 && i <= 6 && j >= 0 && j <= 6) {
          matrix[row][col] = (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) ? 1 : 0;
        } else {
          matrix[row][col] = 0;
        }
      }
    }
  }

  setFinder(0, 0);
  setFinder(0, N - 7);
  setFinder(N - 7, 0);

  // Alignment pattern at (22, 22) for Version 3
  const ar = 22, ac = 22;
  for (let i = -2; i <= 2; i++) {
    for (let j = -2; j <= 2; j++) {
      matrix[ar + i][ac + j] = (Math.abs(i) === 2 || Math.abs(j) === 2 || (i === 0 && j === 0)) ? 1 : 0;
    }
  }

  // Timing patterns
  for (let i = 8; i < N - 8; i++) {
    if (matrix[6][i] === null) matrix[6][i] = (i % 2 === 0) ? 1 : 0;
    if (matrix[i][6] === null) matrix[i][6] = (i % 2 === 0) ? 1 : 0;
  }
  // Dark module
  matrix[4 * 3 + 9][8] = 1;

  // Format info reserve
  for (let i = 0; i < 9; i++) {
    if (matrix[8][i] === null) matrix[8][i] = 0;
    if (matrix[i][8] === null) matrix[i][8] = 0;
  }
  for (let i = 0; i < 8; i++) {
    if (matrix[8][N - 1 - i] === null) matrix[8][N - 1 - i] = 0;
    if (matrix[N - 1 - i][8] === null) matrix[N - 1 - i] = 0;
  }

  // GF(256) arithmetic
  const EXP = new Uint8Array(512);
  const LOG = new Uint8Array(256);
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP[i] = x;
    EXP[i + 255] = x;
    LOG[x] = i;
    x = (x << 1) ^ (x >= 128 ? 0x11d : 0);
  }
  function gmul(a, b) {
    return (a === 0 || b === 0) ? 0 : EXP[LOG[a] + LOG[b]];
  }

  // Reed-Solomon generator polynomial for 15 EC codewords
  let poly = [1];
  for (let i = 0; i < 15; i++) {
    const root = EXP[i];
    const next = new Array(poly.length + 1).fill(0);
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= poly[j];
      next[j + 1] ^= gmul(poly[j], root);
    }
    poly = next;
  }

  // Encode byte data: mode 0100 (byte), 8-bit count for V3
  const bytes = [];
  const chars = [];
  for (let i = 0; i < text.length; i++) chars.push(text.charCodeAt(i));
  let bitBuf = 0, bitLen = 0;
  function putBits(val, len) {
    bitBuf = (bitBuf << len) | val;
    bitLen += len;
    while (bitLen >= 8) {
      bytes.push((bitBuf >>> (bitLen - 8)) & 0xff);
      bitLen -= 8;
    }
  }
  putBits(0b0100, 4); // byte mode
  putBits(chars.length, 8); // character count
  for (const c of chars) putBits(c, 8);
  putBits(0, 4); // terminator
  if (bitLen > 0) bytes.push((bitBuf << (8 - bitLen)) & 0xff);

  // Pad to 55 data bytes
  const pad = [0xec, 0x11];
  let p = 0;
  while (bytes.length < 55) {
    bytes.push(pad[p % 2]);
    p++;
  }

  // Compute EC bytes
  const ec = new Array(15).fill(0);
  for (let i = 0; i < bytes.length; i++) {
    const factor = bytes[i] ^ ec[0];
    ec.shift();
    ec.push(0);
    for (let j = 0; j < 15; j++) {
      ec[j] ^= gmul(poly[j + 1], factor);
    }
  }

  const allCodewords = bytes.concat(ec);
  const dataBits = [];
  for (const b of allCodewords) {
    for (let s = 7; s >= 0; s--) dataBits.push((b >>> s) & 1);
  }

  // Place data bits in matrix (right to left, columns in pairs, zigzag)
  let bitIdx = 0;
  let up = true;
  for (let right = N - 1; right > 0; right -= 2) {
    if (right === 6) right--;
    const cols = [right, right - 1];
    const rows = up
      ? Array.from({ length: N }, (_, k) => N - 1 - k)
      : Array.from({ length: N }, (_, k) => k);
    for (const r of rows) {
      for (const c of cols) {
        if (matrix[r][c] === null) {
          const bit = bitIdx < dataBits.length ? dataBits[bitIdx++] : 0;
          const mask = ((r + c) % 2 === 0) ? 1 : 0;
          matrix[r][c] = bit ^ mask;
        }
      }
    }
    up = !up;
  }

  // Format info: Level L + Mask 0
  const formatBits = [1,1,1,0,1,1,1,1,1,0,0,0,1,0,0];
  const fPos = [
    [8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,7],[8,8],[7,8],[5,8],[4,8],[3,8],[2,8],[1,8],[0,8]
  ];
  for (let i = 0; i < 15; i++) {
    const [r, c] = fPos[i];
    matrix[r][c] = formatBits[i];
  }
  const fPos2 = [
    [N-1,8],[N-2,8],[N-3,8],[N-4,8],[N-5,8],[N-6,8],[N-7,8],[8,N-8],[8,N-7],[8,N-6],[8,N-5],[8,N-4],[8,N-3],[8,N-2],[8,N-1]
  ];
  for (let i = 0; i < 15; i++) {
    const [r, c] = fPos2[i];
    matrix[r][c] = formatBits[i];
  }

  return matrix;
}

function downloadBusinessCard() {
  const link = document.createElement('a');
  link.href = 'assets/images/business_card.jpg';
  link.download = 'Soumyadeep_Pal_Business_Card.jpg';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/** Helper: draw a rounded rectangle path */
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/* ============================================================
   14. NORMAL MODE — ANIMATED NAME GREETING
   - Typing animation on #hero-name-animated
   - 80 ms per character, 400 ms initial delay
   ============================================================ */
function initNormalMode() {
  const nameEl = document.getElementById('hero-name-animated');
  if (!nameEl) return;

  const fullName = 'Soumyadeep Pal';
  nameEl.textContent = '';
  nameEl.setAttribute('aria-label', fullName);

  let charIndex = 0;

  setTimeout(() => {
    const interval = setInterval(() => {
      if (charIndex < fullName.length) {
        nameEl.textContent += fullName[charIndex];
        charIndex++;
      } else {
        clearInterval(interval);
      }
    }, 80);
  }, 400);
}
