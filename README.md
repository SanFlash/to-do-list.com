# AURORA — 3D Productivity Workspace

A premium, responsive productivity workspace with a glass-and-walnut visual language, a GSAP-powered motion system, and a lightweight CSS 3D sculpture. It is built as a static site, so it can deploy directly to Vercel without a build step.

## Features

- Task creation, editing, completion, deletion, priorities, due dates, descriptions, estimates, and subtasks
- My Day, Inbox, Upcoming, All Tasks, project views, search, filters, and priority sorting
- Projects with names, descriptions, and accent colors
- GSAP entrance animation, animated 3D-style hero sculpture, task transitions, and focus-scene motion
- Pomodoro-style focus timer with focus/break modes and saved focus minutes
- Dark and light themes; reduced-motion and 3D artwork settings
- Browser-local persistence and JSON backup export
- Responsive desktop/mobile interface with keyboard-accessible controls
- Command palette: Ctrl+K / Cmd+K
- Vercel static deployment configuration and security headers

## Run locally

No build step is required. Open `index.html` in a browser, or serve the repository with any static file server:

```bash
python -m http.server 4173
```

Then visit http://localhost:4173.

GSAP is loaded from jsDelivr; the application remains usable if the animation CDN is unavailable.

## Deploy on Vercel

1. Import `https://github.com/SanFlash/to-do-list.com` into Vercel.
2. Set **Framework Preset** to **Other**.
3. Leave the Build Command and Output Directory blank/default; the site assets are served from the repository root.
4. Deploy.

No environment variables are required for the current local-first version.

## Data and service limitations

This version stores tasks, projects, theme preferences, and focus totals in the current browser's local storage. Data is not synced between browsers or devices and is not backed up on a server. Use **Settings → Export your tasks** to download a JSON backup.

Authentication, shared workspaces, realtime collaboration, cloud database persistence, server-side reminders, email/push delivery, and AI integrations are not configured in this repository. They require a backend service such as Supabase plus schema, Row Level Security, and provider configuration before they can be described as production-ready.

## Structure

- `index.html` — accessible application shell and views
- `style.css` — responsive design tokens, glass materials, layouts, mobile navigation, and reduced-motion support
- `script.js` — task/project state, local persistence, search commands, GSAP motion, and focus timer
- `vercel.json` — Vercel routing defaults and security headers

## QA checklist

- [ ] Verify task create/edit/complete/delete flows
- [ ] Verify project creation and project switching
- [ ] Verify export JSON opens and includes tasks/projects
- [ ] Test at 360px, 390px, 768px, 1024px, and desktop widths
- [ ] Verify reduced-motion and light-theme settings
- [ ] Verify Vercel deployment logs and browser console
- [ ] Configure and test cloud persistence before multi-device use

Built as a local-first, Vercel-hostable application.
