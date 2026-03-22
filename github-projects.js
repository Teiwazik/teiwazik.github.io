// GitHub username
const GITHUB_USER = 'Teiwazik';

// Helper to get translation
const t = (key) => window.i18n ? window.i18n.t(key) : key;

// Category mapping by language / keywords
function getCategory(repo) {
  const lang = (repo.language || '').toLowerCase();
  const name = repo.name.toLowerCase();
  const desc = (repo.description || '').toLowerCase();

  if (lang === 'c++' || lang === 'c' || name.includes('arduino') || desc.includes('arduino') || desc.includes('display') || desc.includes('led')) {
    return 'Hardware / Embedded';
  }
  if (lang === 'typescript' || lang === 'javascript' || lang === 'html' || lang === 'css') {
    return 'Web / Desktop Apps';
  }
  if (name.includes('minecraft') || desc.includes('minecraft') || desc.includes('mod') || desc.includes('resource')) {
    return 'Minecraft / Gaming';
  }
  return 'Other';
}

const CATEGORY_MAP = {
  'Web / Desktop Apps':    { icon: '🌐', key: 'gh_tab_web' },
  'Hardware / Embedded':   { icon: '🔧', key: 'gh_tab_hardware' },
  'Minecraft / Gaming':    { icon: '🎮', key: 'gh_tab_games' },
  'Other':                 { icon: '📦', key: 'gh_tab_other' },
};

const LANG_COLORS = {
  TypeScript:  '#3178c6',
  JavaScript:  '#f7df1e',
  HTML:        '#e34c26',
  CSS:         '#563d7c',
  'C++':       '#f34b7d',
  C:           '#555555',
  Python:      '#3572A5',
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const lang = window.i18n ? window.i18n.getLang() : 'en';
  return d.toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

function renderLangBadge(lang) {
  if (!lang) return '';
  const color = LANG_COLORS[lang] || '#888';
  return `<span class="gh-lang-badge"><span class="gh-lang-dot" style="background:${color}"></span>${lang}</span>`;
}

async function loadGitHubStats() {
  const container = document.getElementById('github-stats');
  if (!container) return;

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USER}`),
      fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`)
    ]);
    const user = await userRes.json();
    const repos = await reposRes.json();

    const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
    const totalForks = repos.reduce((s, r) => s + r.forks_count, 0);
    const languages = [...new Set(repos.map(r => r.language).filter(Boolean))];
    const memberSince = new Date(user.created_at).getFullYear();

    container.innerHTML = `
      <div class="gh-stat-card" data-tilt data-tilt-max="15" data-tilt-speed="3000" data-tilt-glare data-tilt-max-glare="0.1">
        <img src="${user.avatar_url}" alt="Avatar" class="gh-avatar">
        <div class="gh-stat-info">
          <div class="gh-stat-name">${user.name || user.login}</div>
          <div class="gh-stat-bio">${user.bio || ''}</div>
          <a href="${user.html_url}" target="_blank" class="gh-profile-link">
            <img src="github_logo_icon_229278.webp" alt="GitHub" style="width:18px;height:18px;vertical-align:middle;margin-right:6px;">
            @${user.login}
          </a>
        </div>
      </div>

      <div class="gh-stats-grid">
        <div class="gh-stat-item">
          <span class="gh-stat-num">${user.public_repos}</span>
          <span class="gh-stat-label">${t('gh_stats_repos')}</span>
        </div>
        <div class="gh-stat-item">
          <span class="gh-stat-num">${totalStars}</span>
          <span class="gh-stat-label">${t('gh_stats_stars')}</span>
        </div>
        <div class="gh-stat-item">
          <span class="gh-stat-num">${totalForks}</span>
          <span class="gh-stat-label">${t('gh_stats_forks')}</span>
        </div>
        <div class="gh-stat-item">
          <span class="gh-stat-num">${user.followers}</span>
          <span class="gh-stat-label">${t('gh_stats_followers')}</span>
        </div>
        <div class="gh-stat-item">
          <span class="gh-stat-num">${user.following}</span>
          <span class="gh-stat-label">${t('gh_stats_following')}</span>
        </div>
        <div class="gh-stat-item">
          <span class="gh-stat-num">${memberSince}</span>
          <span class="gh-stat-label">${t('gh_stats_since')}</span>
        </div>
      </div>

      <div class="gh-langs-section">
        <div class="gh-langs-title">${t('gh_langs_title')}</div>
        <div class="gh-langs-list">
          ${languages.map(lang => {
            const color = LANG_COLORS[lang] || '#888';
            return `<span class="gh-lang-pill" style="border-color:${color};color:${color}">
              <span class="gh-lang-dot" style="background:${color}"></span>${lang}
            </span>`;
          }).join('')}
        </div>
      </div>
    `;
    
    if (window.VanillaTilt) {
      VanillaTilt.init(container.querySelectorAll('.gh-stat-card'), { max: 10, speed: 3000 });
    }
  } catch (err) {
    console.error('GitHub stats error:', err);
    container.innerHTML = `<p style="color:#aaa;text-align:center">${t('gh_stats_loading')}</p>`;
  }
}

let cachedRepos = [];
let activeCategory = 'all';

async function loadGitHubProjects() {
  const container = document.getElementById('github-projects-container');
  const filterContainer = document.getElementById('github-filter-tabs');
  if (!container) return;

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`);
    cachedRepos = await res.json();
    renderTabs(filterContainer);
    renderCards(container, activeCategory);
  } catch (err) {
    console.error('GitHub projects error:', err);
    container.innerHTML = `<p style="color:#aaa;text-align:center">${t('gh_projects_loading')}</p>`;
  }
}

function renderTabs(filterContainer) {
  if (!filterContainer) return;
  filterContainer.innerHTML = '';
  
  const filtered = cachedRepos.filter(r => r.name !== `${GITHUB_USER.toLowerCase()}.github.io` || cachedRepos.length <= 1);
  const groups = {};
  filtered.forEach(repo => {
    const cat = getCategory(repo);
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(repo);
  });

  const categories = Object.keys(groups);

  const allBtn = document.createElement('button');
  allBtn.className = `gh-tab ${activeCategory === 'all' ? 'active' : ''}`;
  allBtn.innerHTML = `${t('gh_tab_all')} <span class="gh-tab-count">${filtered.length}</span>`;
  allBtn.onclick = () => { activateTab('all'); };
  filterContainer.appendChild(allBtn);

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `gh-tab ${activeCategory === cat ? 'active' : ''}`;
    const info = CATEGORY_MAP[cat] || { icon: '📦', key: 'gh_tab_other' };
    btn.innerHTML = `${info.icon} ${t(info.key)} <span class="gh-tab-count">${groups[cat].length}</span>`;
    btn.onclick = () => { activateTab(cat); };
    filterContainer.appendChild(btn);
  });
}

function activateTab(cat) {
  activeCategory = cat;
  const container = document.getElementById('github-projects-container');
  const filterContainer = document.getElementById('github-filter-tabs');
  renderTabs(filterContainer);
  renderCards(container, cat);
}

function renderCards(container, cat) {
  if (!container) return;
  container.innerHTML = '';
  
  const filtered = cachedRepos.filter(r => r.name !== `${GITHUB_USER.toLowerCase()}.github.io` || cachedRepos.length <= 1);
  const groups = {};
  filtered.forEach(repo => {
    const c = getCategory(repo);
    if (!groups[c]) groups[c] = [];
    groups[c].push(repo);
  });

  const toRender = cat === 'all' ? filtered : (groups[cat] || []);
  
  toRender.forEach((repo, i) => {
    const card = document.createElement('div');
    card.className = 'gh-project-card hover-in';
    card.style.animationDelay = `${i * 0.05}s`;

    const c = getCategory(repo);
    const info = CATEGORY_MAP[c] || { icon: '📦', key: 'gh_tab_other' };

    card.innerHTML = `
      <div class="gh-card-header">
        <div class="gh-card-title-row">
          <span class="gh-card-cat-icon">${info.icon}</span>
          <a href="${repo.html_url}" target="_blank" class="gh-card-name">${repo.name}</a>
          ${repo.fork ? `<span class="gh-fork-badge">${t('gh_repo_fork')}</span>` : ''}
        </div>
        <p class="gh-card-desc">${repo.description || `<em style="color:#666">${t('no_desc')}</em>`}</p>
      </div>
      <div class="gh-card-footer">
        <div class="gh-card-meta">
          ${renderLangBadge(repo.language)}
          <span class="gh-meta-item">⭐ ${repo.stargazers_count}</span>
          <span class="gh-meta-item">🍴 ${repo.forks_count}</span>
        </div>
        <div class="gh-card-updated">${t('gh_repo_updated')}: ${formatDate(repo.updated_at)}</div>
      </div>
    `;
    container.appendChild(card);
  });

  if (window.VanillaTilt) {
    VanillaTilt.init(container.querySelectorAll('.gh-project-card'), {
      max: 10,
      speed: 3000,
      glare: true,
      'max-glare': 0.08,
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadGitHubStats();
  loadGitHubProjects();
});

window.addEventListener('langChanged', () => {
  loadGitHubStats(); // Refresh labels
  const filterContainer = document.getElementById('github-filter-tabs');
  const container = document.getElementById('github-projects-container');
  renderTabs(filterContainer);
  renderCards(container, activeCategory);
});
