# Soumyadeep Pal — Personal Developer Portfolio

A modern, high-performance personal portfolio website built with clean **HTML5**, **CSS3**, and **Vanilla JavaScript**. Designed with an executive royal blue and teal palette, soft off-white surfaces, crisp card elevation, responsive typography, interactive animations, and FormSubmit integration for direct email contact.

![Portfolio Profile](assets/images/profile.jpg)

---

## 🌟 Key Highlights

- **Executive Royal Blue & Teal Color Palette**: Professional light theme by default (soft off-white `#f8fafc`, light blue-grey `#eef4f8`, royal blue `#1d4ed8`, teal `#0d9488`, and charcoal `#0f172a`), with a persistent **Dark Theme toggle** stored in `localStorage`.
- **Actual Portrait Photograph**: Integrated high-resolution portrait photograph in an elegant squircle frame with subtle gradient border, elevated shadow, and smooth hover interaction.
- **Zero Heavy Dependencies**: Pure semantic HTML5, modern CSS with custom properties (CSS variables), and vanilla JavaScript. No node modules, build steps, or frameworks required.
- **Ultra-Responsive**: Fluid clamp typography and adaptive layout optimized across mobile phones, tablets, laptops, and desktop monitors.
- **AI Tools & Productivity Section**: Dedicated showcase for ChatGPT & Claude, AI-assisted coding, Prompt Engineering, and AI-powered research.
- **Expanded Project Showcase (6 Projects)**:
  1. **CropSense AI**: AI in agriculture with live deployment preview (Live Demo).
  2. **EduPilot AI**: AI-powered education platform (Collaborative project with GitHub & Live Demo).
  3. **EventIQ**: Event management website with full responsive UI.
  4. **Smart Factory Dashboard**: Industrial IoT monitoring dashboard with live telemetry.
  5. **WallBot**: Wall climbing painting robot for high-altitude surfaces.
  6. **Train Reservation System**: High-reliability transaction and berth allotment engine.
- **Centralized Document Registry ("SEE DOCUMENTS")**: Dedicated documents section featuring verified credentials, LinkedIn Learning certificate, supplementary study documents, and downloadable resume.
- **Production-Ready Contact Engine**: Four-field contact form (*Full Name*, *Designation*, *Email Address*, *Description / Message*) wired directly to [FormSubmit](https://formsubmit.co) with honeypot spam protection, real AJAX feedback, and zero login barriers.
- **GitHub Pages Ready**: 100% compatible with static hosting on GitHub Pages, Vercel, Netlify, or Apache/Nginx.

---

## 📁 Repository Structure

```text
portfolio/
│
├── index.html                  # Semantic, accessible HTML5 single-page structure
├── css/
│   └── style.css               # Modern CSS variables, executive palette, responsive styles
├── js/
│   └── script.js               # Theme toggle, scroll observer, FormSubmit AJAX, documents registry
├── assets/
│   ├── documents/
│   │   └── resume.pdf          # Official B.Tech IT resume PDF
│   ├── images/
│   │   ├── profile.jpg         # Soumyadeep Pal's official photograph
│   │   ├── cropsense.svg       # CropSense AI project graphic
│   │   ├── edupilot.svg        # EduPilot AI project graphic
│   │   ├── wallbot.svg         # Wall climbing painting robot graphic
│   │   ├── eventiq.svg         # EventIQ management web app graphic
│   │   ├── smart-factory.svg   # Smart factory IoT telemetry dashboard graphic
│   │   └── train-reservation.svg # Train reservation engine graphic
│   └── icons/
│       ├── favicon.svg         # Stylized monogram brand favicon
│       ├── github.svg          # GitHub SVG icon
│       ├── linkedin.svg        # LinkedIn SVG icon
│       ├── youtube.svg         # YouTube SVG icon
│       └── mail.svg            # Mail SVG icon
└── README.md                   # Comprehensive documentation & setup instructions
```

---

## 🚀 Sections Overview

1. **Home (Hero)**:
   - High-resolution framed photograph of Soumyadeep Pal.
   - Title & Subtitle: `B.Tech IT Student | Aspiring Software Developer | AI & ML Enthusiast`.
   - Call-To-Action buttons: **"Explore My Work"**, **"View My Resume"** (opens `assets/documents/resume.pdf` in a new tab), **Download Resume**, and **"Contact Me"**.
   - Verified social links: GitHub, LinkedIn, YouTube, Direct Email.
2. **About Me**:
   - Academic narrative as a second-year B.Tech IT student at IEM Kolkata.
   - Core programming capabilities in C, C++, Java, and Python.
   - Algorithmic problem-solving in DSA using C++, plus active study in AI & ML.
3. **Skills**:
   - **Programming Languages**: C, C++, Java, Python.
   - **Web Technologies**: HTML, CSS, JavaScript.
   - **Database & Tools**: MySQL, Git, GitHub.
   - **Currently Learning**: DSA using C++, Artificial Intelligence, Machine Learning, Prompt Engineering.
4. **AI Tools & Productivity**:
   - **ChatGPT & Claude**: Advanced conversational reasoning, code analysis, and architecture ideation.
   - **AI-Assisted Coding**: Copilot, automated refactoring, and test synthesis.
   - **Prompt Engineering**: Few-shot prompting, chain-of-thought, and structured outputs.
   - **AI-Based Research & Productivity**: Paper analysis, documentation intelligence, and technical synthesis.
5. **Projects**:
   - **CropSense AI**: AI agriculture insights with Live Demo button.
   - **EduPilot AI**: AI educational assistant (Collaborative) with Repository and Live Demo buttons.
   - **EventIQ**: Responsive event coordination and ticket tracking.
   - **Smart Factory Dashboard**: Live telemetry monitoring for industrial environments.
   - **WallBot**: Automated vertical surface painting robot.
   - **Train Reservation System**: High-reliability transaction and passenger allocation engine.
6. **Achievements**:
   - **NPTEL Elite + Silver Certification** (Ranked in the **Top 5%** nationally).
   - **Hackathon Participation** (Competitive problem solving and rapid prototyping).
   - **Academic Achievements** (Institutional excellence at IEM Kolkata).
7. **Education**:
   - Bachelor of Technology (B.Tech) in Information Technology — Second Year at Institute of Engineering and Management (IEM), Kolkata.
8. **Contact Me**:
   - Four-field FormSubmit contact form (*Full Name*, *Designation*, *Email*, *Description / Message*).
   - Direct email channel: `soumyadeepp269@gmail.com` with quick one-click clipboard copy.
9. **See Documents**:
   - Centralized registry of credentials, certificates, and learning resources.
   - LinkedIn Learning Certificate, Google Drive Learning Document, and Official Resume PDF.
10. **Footer**:
    - Role definition, full site navigation, verified social channels, copyright notice, and back-to-top button.

---

## 📄 Centralized Document Management ("SEE DOCUMENTS")

The documents section is powered by a clean, centralized configuration in [`portfolio/js/script.js`](file:///d:/SoumyadeepPal/portfolio/js/script.js).

### How to Add a New PDF Document:
1. **Copy your new PDF file** into the `portfolio/assets/documents/` folder:
   ```text
   portfolio/assets/documents/my_new_certificate.pdf
   ```

2. **Open `portfolio/js/script.js`** and locate the `documentsConfig` array (around line 382):
   ```javascript
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
       description: "Official B.Tech IT resume highlighting core programming in C, C++, Java, and Python..."
     },
     // ... other existing documents
   ];
   ```

3. **Append a new entry** to the array:
   ```javascript
     {
       id: "doc-new-certificate",
       title: "Cloud Computing Specialization Certificate",
       category: "Professional Credential",
       url: "assets/documents/my_new_certificate.pdf",
       badge: "Verified Credential",
       viewText: "View Certificate",
       download: true,
       downloadFilename: "Soumyadeep_Pal_Cloud_Certificate.pdf",
       description: "Certification covering cloud infrastructure design, virtual networking, and containerization."
     }
   ```

4. **Save the file!** The website will automatically render the new document card with proper icons, badges, view in new tab, and download buttons.

---

## 📬 FormSubmit Configuration & Email Verification

The contact form is configured to deliver messages to:
```text
https://formsubmit.co/soumyadeepp269@gmail.com
```

### How to Activate FormSubmit (One-Time Step):
1. Open the portfolio website in your browser and submit a test message through the form.
2. FormSubmit will dispatch a **one-time activation email** to `soumyadeepp269@gmail.com` with the subject:
   > *"Action Required: Activate FormSubmit"*
3. Open your inbox and click the **"Activate Form"** button inside the email.
4. **Done!** From that moment forward, every visitor message will be delivered immediately to your inbox with the sender's email address set as the `Reply-To`.

---

## 🛠️ How to Run Locally

You can test and view the website locally using any standard browser:

### Option 1: Direct File Open
Simply double-click `portfolio/index.html` in your file explorer or open it in Chrome, Edge, Firefox, or Safari.

### Option 2: Using Python HTTP Server (Recommended)
Open PowerShell or Terminal in the `portfolio` folder and run:
```powershell
cd d:\SoumyadeepPal\portfolio
python -m http.server 8080
```
Then visit `http://localhost:8080` in your browser.

---

## 🌐 Deploying to GitHub Pages (Manual Instructions)

*(Note: Per your instructions, changes are kept local and have NOT been pushed to GitHub automatically).*

When you are ready to publish your updates to GitHub Pages:

1. **Commit your changes**:
   ```bash
   git status
   git add .
   git commit -m "feat: executive royal blue theme, real photograph, CropSense & EduPilot AI, AI tools & documents section"
   ```

2. **Push to GitHub**:
   ```bash
   git push origin main
   ```

3. **Verify GitHub Pages**:
   - Go to your repository on GitHub: `https://github.com/SoumyadeepPal2007/SoumyadeepPal`.
   - Settings > Pages > Ensure `main` branch is selected.
   - Your site will update automatically at `https://soumyadeeppal2007.github.io/SoumyadeepPal/`.

---

## 📄 License
This portfolio is created for **Soumyadeep Pal**.
