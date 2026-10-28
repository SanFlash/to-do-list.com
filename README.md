<!--
  AURORA • motion atlas
  Built for a cinematic, accessible, motion-rich productivity experience.
-->

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0b0d10,40:29251d,75:62513a,100:d6b77a&height=230&section=header&text=AURORA&fontSize=78&fontColor=f4f0e8&animation=fadeIn&fontAlignY=36&desc=YOUR%20TASKS.%20IN%20A%20NEW%20DIMENSION.&descSize=15&descAlignY=57&descColor=eee0c5" width="100%" alt="AURORA — Your tasks in a new dimension" />

<p>
  <strong>A motion-rich, local-first productivity workspace.</strong><br/>
  A tactile glass interface, expressive GSAP animation, floating orbital graphics, focus rituals, and fast everyday task management.
</p>

<p>
  <a href="https://github.com/SanFlash/to-do-list.com"><img src="https://img.shields.io/badge/REPOSITORY-SanFlash%2Fto--do--list.com-d6b77a?style=for-the-badge&logo=github&logoColor=0b0d10" alt="GitHub repository" /></a>
  <img src="https://img.shields.io/badge/GSAP-MOTION%20ENGINE-88CE02?style=for-the-badge&logo=greensock&logoColor=101318" alt="GSAP motion engine" />
  <img src="https://img.shields.io/badge/DEPLOY-VERCEL-ffffff?style=for-the-badge&logo=vercel&logoColor=000000" alt="Vercel deployment" />
  <img src="https://img.shields.io/badge/MODE-LOCAL--FIRST-9c91ff?style=for-the-badge" alt="Local first" />
</p>

<img src="https://readme-typing-svg.demolab.com?font=Manrope&weight=600&size=18&duration=2800&pause=800&color=D6B77A&center=true&vCenter=true&width=700&lines=Capture+the+thought.;Make+the+next+move.;Protect+your+focus.;Let+small+wins+compound." alt="Capture. Plan. Focus. Finish." />

</div>

---

## ✦ The experience

AURORA is a static, responsive task workspace designed to feel alive without making productivity feel noisy. The interface pairs warm champagne highlights with deep obsidian surfaces, layered glass, quiet 3D geometry, and an ambient motion layer.

The goal is **high visual energy, low interaction friction**: motion supports hierarchy, focus and feedback; it does not get between you and your work.

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=rect&color=0b0d10&height=2&section=header" width="100%" alt="" />

| ◈ AMBIENCE | ✳ INTERACTION | ◉ FOCUS |
|:---:|:---:|:---:|
| Floating particle field and orbital rings | Responsive hover states and task transitions | Animated focus sculpture and Pomodoro timer |
| Layered glass, warm glow and shimmer | GSAP view entrances and micro-interactions | Distraction-conscious reduced-motion mode |

</div>

## ✧ Motion atlas

The visuals are built as layers, rather than one giant animation. The app keeps its original task and project logic while a dedicated `motion.js` layer adds ambient depth and interaction choreography.

<table>
  <tr>
    <td width="50%">
      <h3>01 · Orbital atmosphere</h3>
      A canvas particle field draws quiet connecting threads behind the interface. Slow orbital rings and ambient gradients add depth without blocking clicks or keyboard navigation.
    </td>
    <td width="50%">
      <h3>02 · Cinematic hero</h3>
      The crystal sculpture, orbit accents, luminous core and gradient typography use restrained looping motion. On desktop, the sculpture responds subtly to pointer movement.
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>03 · Tactile interface</h3>
      Task cards lift softly; check controls respond to hover; buttons get a passing sheen; stat panels reveal a gentle highlight; modals and toasts arrive with brief, deliberate transitions.
    </td>
    <td width="50%">
      <h3>04 · Focus scene</h3>
      The focus rings float around the glass sculpture while the session timer tracks focus and break modes. Motion stays atmospheric, not distracting.
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>05 · Living navigation</h3>
      Main views animate into place with short, staggered entrances. Project, settings and task surfaces maintain a consistent motion language.
    </td>
    <td width="50%">
      <h3>06 · Accessible by design</h3>
      The app respects the OS-level reduced-motion setting and provides a dedicated Reduced motion switch. The ambient canvas pauses when the tab is hidden and adapts its density for smaller screens.
    </td>
  </tr>
</table>

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=rect&color=29251d&height=1&section=header" width="82%" alt="" />

<sub>DESIGN PRINCIPLE · Motion should clarify, reward, and guide — never obstruct.</sub>

</div>

## ⚡ Feature set

| Area | Capabilities |
|---|---|
| **Task management** | Create, edit, complete, reopen, and delete tasks; title, description, priority, due date, estimate, project, and subtasks |
| **Workspace views** | My Day, Inbox, Upcoming, All Tasks, project workspaces, filters, priority sorting, and task search |
| **Projects** | Create named projects with descriptions and accent colours |
| **Focus** | Pomodoro-style focus and break timer, saved daily focus minutes, and animated focus view |
| **Personalisation** | Dark/Light themes, 3D artwork toggle, reduced motion, keyboard-friendly controls |
| **Backup** | Export tasks, projects, and settings to JSON |
| **Command palette** | `Ctrl + K` on Windows/Linux or `Cmd + K` on macOS |
| **Deployment** | Static-site deployment; no framework build step or environment variables required |

## ◌ Visual language

<div align="center">

| OBSIDIAN | CHAMPAGNE | IRIS | SAGE |
|:---:|:---:|:---:|:---:|
| <img src="https://placehold.co/120x48/0b0d10/f4f0e8?text=Obsidian" alt="Obsidian" /> | <img src="https://placehold.co/120x48/d6b77a/0b0d10?text=Champagne" alt="Champagne" /> | <img src="https://placehold.co/120x48/9c91ff/101318?text=Iris" alt="Iris" /> | <img src="https://placehold.co/120x48/7cb8a2/101318?text=Sage" alt="Sage" /> |

</div>

Typography uses Manrope for expressive headings, DM Sans for everyday UI, and DM Mono for compact technical labels. The visual system combines translucent panels, thin borders, soft shadows, orbital line art and restrained gradients.

## 🚀 Run locally

AURORA is a static site. No build command is needed.

```bash
git clone https://github.com/SanFlash/to-do-list.com.git
cd to-do-list.com
python -m http.server 4173
```

Open **http://localhost:4173**.

GSAP and Three.js are loaded from jsDelivr. Core task functionality remains plain JavaScript; if the animation CDN/WebGL is unavailable, the task app can still be used and the hero falls back to CSS artwork.

## ☁️ Deploy to Vercel

1. Import [SanFlash/to-do-list.com](https://github.com/SanFlash/to-do-list.com) into Vercel.
2. Choose **Other** as the Framework Preset.
3. Keep the Build Command empty and serve the repository root.
4. Deploy.

No environment variables are required for the current local-first version.

## 🧭 Project structure

```text
to-do-list.com/
├── .github/workflows/validate.yml  # CI syntax and file checks
├── index.html                      # Semantic app shell and views
├── style.css                       # Responsive layout and visual system
├── script.js                       # Task state, local persistence and app logic
├── motion.js                       # Ambient canvas, UI motion and GSAP choreography
├── visuals.js                      # GSAP + Three.js real-time 3D visual engine
├── vercel.json                     # Static deployment configuration
└── README.md                       # This project guide
```

## ♿ Motion accessibility

AURORA is intentionally animated, but the animation layer is not allowed to become a usability tax.

- The system `prefers-reduced-motion` preference is respected.
- **Settings → Reduced motion** disables non-essential CSS motion and pauses the GSAP global timeline.
- Canvas animation pauses when the browser tab is hidden.
- Decorative layers use `pointer-events: none` and are hidden from assistive technologies.
- Responsive rules reduce particle count and glow intensity on smaller screens.

## 💾 Data model and limitations

Tasks, projects, theme preferences and focus totals are saved in the current browser's local storage. This means data is **not synced** across devices or browsers and is not automatically backed up on a server. Use **Settings → Export your tasks** to make a JSON backup.

Authentication, shared workspaces, realtime collaboration, cloud database persistence, server-side reminders, email/push delivery and AI integrations are not configured here. These require a backend and security rules before the features can be considered production-ready.

## ✅ Validation checklist

- [ ] Create, edit, complete, reopen and delete tasks
- [ ] Create a project and move between project views
- [ ] Test subtask completion and filters
- [ ] Export JSON and confirm tasks/projects are included
- [ ] Test dark and light themes
- [ ] Toggle reduced motion and verify the canvas/GSAP layer pauses
- [ ] Test mobile layouts at 360px, 390px and 768px
- [ ] Check browser console and Vercel deployment logs
- [ ] Verify the site remains usable when the animation CDN is blocked

## 🛠️ Built with

<p align="left">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=111111" alt="JavaScript" />
  <img src="https://img.shields.io/badge/GSAP-88CE02?style=flat-square&logo=greensock&logoColor=111111" alt="GSAP" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel" />
</p>

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:d6b77a,45:62513a,100:0b0d10&height=130&section=footer" width="100%" alt="" />

**AURORA — Progress over perfection. One intentional move at a time.**

<sub>Created by Satyendra Kumar Namdeo</sub>

</div>
