const state = { roles: [], projects: [], integrations: [], selectedRole: null, selectedProject: null };
const tabs = ['Overview','Team Members','Live Activity','Communication','Reports','Knowledge Transfer','Testing','Automation','Bugs','Files','Meetings','Release','Analytics','Integrations','AI Assistant'];

async function boot() {
  const response = await fetch('/api/v1/workspace');
  Object.assign(state, await response.json());
  state.selectedRole = state.roles[3];
  state.selectedProject = state.projects[0];
  render();
  connectLiveEvents();
}

function render() { renderRoles(); renderProjects(); renderCommandCenter(); renderWorkspace(); }

function renderRoles() {
  document.getElementById('roleNav').innerHTML = state.roles.map(role => `<button class="role-btn ${role.slug === state.selectedRole.slug ? 'active' : ''}" data-role="${role.slug}"><strong>${role.name}</strong><small>${role.permissions.length} permissions · ${role.widgets.length} widgets</small></button>`).join('');
  document.querySelectorAll('[data-role]').forEach(button => button.onclick = () => { state.selectedRole = state.roles.find(role => role.slug === button.dataset.role); render(); });
  document.getElementById('assistantFocus').textContent = state.selectedRole.assistant_focus;
}

function renderProjects() {
  document.getElementById('projects').innerHTML = state.projects.map(project => `<article class="project-card" style="--accent:${project.accent}" data-project="${project.name}"><h3>${project.name}</h3><p class="meta">${project.client} · ${project.manager} · ${project.sprint}</p><div class="metrics"><span class="metric"><strong>${project.health}</strong>Health</span><span class="metric"><strong>${project.automation}%</strong>Automation</span><span class="metric"><strong>${project.testing}%</strong>Testing</span><span class="metric"><strong>${project.openBugs}</strong>Open bugs</span><span class="metric"><strong>${project.criticalBugs}</strong>Critical</span><span class="metric"><strong>${project.reports}</strong>Reports</span></div><p class="meta">${project.members} members · ${project.office} office · ${project.remote} remote · ${project.offline} offline</p><p class="meta">${project.tracker} tracker · ${project.environment} · ${project.build}</p><span class="risk ${project.risk}">${project.risk} AI risk · release ${project.releaseCountdown}</span></article>`).join('');
  document.querySelectorAll('[data-project]').forEach(card => card.onclick = () => { state.selectedProject = state.projects.find(project => project.name === card.dataset.project); renderCommandCenter(); });
}

function renderCommandCenter() {
  const project = state.selectedProject;
  document.getElementById('commandTitle').textContent = `${project.name} mission control`;
  document.getElementById('commandMeta').textContent = `${project.client} · ${project.environment} · current build ${project.build} · ${project.tracker} live tracker · ${project.risk} AI risk.`;
  document.getElementById('commandTabs').innerHTML = tabs.map(tab => `<span class="tab">${tab}</span>`).join('');
}

function renderWorkspace() {
  document.getElementById('widgets').innerHTML = state.selectedRole.widgets.map(widget => `<span class="chip">${widget}</span>`).join('');
  document.getElementById('integrations').innerHTML = state.integrations.map(name => `<span class="chip">${name}</span>`).join('');
}

function addFeedItem(event) {
  const feed = document.getElementById('activityFeed');
  feed.insertAdjacentHTML('afterbegin', `<div class="feed-item"><span><strong>${event.activity}</strong> in ${event.project} by ${event.actor}</span><time>${event.at}</time></div>`);
  [...feed.children].slice(10).forEach(node => node.remove());
}

function connectLiveEvents() {
  const source = new EventSource('/api/v1/events');
  source.onmessage = message => {
    const event = JSON.parse(message.data);
    addFeedItem(event);
    const index = state.projects.findIndex(project => project.name === event.projectUpdate.name);
    if (index >= 0) state.projects[index] = event.projectUpdate;
    document.getElementById('liveUsers').textContent = 240 + Math.floor(Math.random() * 30);
    document.getElementById('notificationCount').textContent = 30 + Math.floor(Math.random() * 20);
    renderProjects();
  };
  source.onerror = () => addFeedItem({ activity: 'Realtime fallback active', project: 'Workspace', actor: 'System', at: new Date().toLocaleTimeString() });
}

document.getElementById('themeToggle').onclick = () => document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
document.getElementById('smartSearch').addEventListener('input', event => {
  const term = event.target.value.toLowerCase();
  document.querySelectorAll('.project-card').forEach(card => card.style.display = card.textContent.toLowerCase().includes(term) ? '' : 'none');
});
boot();
