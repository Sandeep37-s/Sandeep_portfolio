# Sandeep Kumar — Portfolio

A premium, dark, futuristic portfolio built with plain **HTML, CSS, and vanilla JavaScript (ES modules)** — no frameworks, no build step. Fully static and deployable on GitHub Pages.

## ✨ Highlights

- **"Neural Singularity" intro** — a canvas-based cinematic sequence (particles → spiraling black hole → flash → reveal), skippable, and disabled automatically for `prefers-reduced-motion`.
- **Ambient background** — drifting particles, neural-network constellation lines, twinkling stars, and slow aurora gradients on a single `<canvas>`, capped for 60fps.
- **Magnetic custom cursor** — trailing ring, hover morph on interactive elements, and a particle burst on click (desktop / fine-pointer only; falls back to the native cursor on touch devices).
- **Scroll-driven motion** — staggered reveal-on-scroll (fade/blur/scale/slide variants per section), a glowing timeline progress line, and a subtle hero parallax.
- **Glassmorphic UI** — tilting project/skill cards, animated gradient borders, shine sweeps, magnetic/liquid-ripple buttons, and floating-label form fields.
- **Content preserved 1:1** from the original site: About, Skills, Experience, Projects, Education, and Contact.

## 📁 Project structure

```
portfolio/
│── index.html
│── css/
│   ├── variables.css     → colors, type, spacing, shadow tokens
│   ├── style.css         → global reset + section/layout structure
│   ├── components.css    → navbar, buttons, cards, badges, forms, footer
│   ├── animations.css    → keyframes + scroll-reveal utility classes
│   └── responsive.css    → all media queries
│── js/                   → one ES module per feature
│   ├── main.js           → boots the intro, then every module below
│   ├── utilities.js      → lerp/clamp/debounce/reduced-motion helpers
│   ├── intro.js          → black-hole intro animation
│   ├── particles.js      → ambient background canvas
│   ├── cursor.js         → magnetic cursor, trail, click burst, ripple
│   ├── typing.js         → hero role typewriter effect
│   ├── scroll.js         → reveal-on-scroll + timeline progress
│   ├── navbar.js         → navbar shrink + active-link highlight
│   ├── counters.js       → animated hero statistics
│   └── animations.js     → 3D card tilt + hero spotlight
│── assets/
│   ├── images/           → add project screenshots here
│   ├── icons/            → add custom icon assets here
│   ├── fonts/            → add self-hosted fonts here (optional)
│   └── resume-placeholder.txt → replace with your resume.pdf
│── favicon/
│   └── favicon.svg
└── README.md
```

## ▶️ Running locally

Because `index.html` loads JavaScript as ES modules (`type="module"`), open it through a local server rather than the `file://` protocol:

```bash
# Python
python3 -m http.server 8080

# or Node
npx serve .
```

Then visit `http://localhost:8080`.

## 🚀 Deploying to GitHub Pages

1. Push this folder to a GitHub repository.
2. In **Settings → Pages**, set the source to the branch/folder containing `index.html`.
3. Your site will be live at `https://<username>.github.io/<repo>/`.

## 🎨 Customizing

- **Colors / fonts / spacing** — edit `css/variables.css`.
- **Content** (name, role, bio, projects, experience, education, contact) — edit the corresponding `<section>` in `index.html`.
- **Intro timing** — adjust `PHASE_SCATTER_END`, `PHASE_COLLAPSE_END`, `PHASE_FLASH_END` in `js/intro.js`.
- **Resume download** — drop a `resume.pdf` into `assets/` and link it from the hero or contact section.

## ♿ Accessibility

- Respects `prefers-reduced-motion` (intro, reveals, and the ambient canvas all degrade gracefully).
- Custom cursor is disabled on touch/coarse-pointer devices, restoring the native cursor.
- Semantic sectioning, labelled form fields, and visible focus states throughout.
