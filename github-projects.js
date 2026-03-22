// GitHub username
const GITHUB_USER = 'Teiwazik';

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

const CATEGORY_ICONS = {
  'Web / Desktop Apps':    '🌐',
  'Hardware / Embedded':   '🔧',
  'Minecraft / Gaming':    '🎮',
  'Other':                 '📦',
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
  return d.toLocaleDateString('ru-RU', { year: 'numeric', month: 'short', day: 'numeric' });
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

    // Count commits would require extra API calls, so we skip for rate limit safety
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
          <span class="gh-stat-label">Репозитории</span>
        </div>
        <div class="gh-stat-item">
          <span class="gh-stat-num">${totalStars}</span>
          <span class="gh-stat-label">Stars ⭐</span>
        </div>
        <div class="gh-stat-item">
          <span class="gh-stat-num">${totalForks}</span>
          <span class="gh-stat-label">Forks 🍴</span>
        </div>
        <div class="gh-stat-item">
          <span class="gh-stat-num">${user.followers}</span>
          <span class="gh-stat-label">Подписчики</span>
        </div>
        <div class="gh-stat-item">
          <span class="gh-stat-num">${user.following}</span>
          <span class="gh-stat-label">Подписки</span>
        </div>
        <div class="gh-stat-item">
          <span class="gh-stat-num">${memberSince}</span>
          <span class="gh-stat-label">На GitHub с</span>
        </div>
      </div>

      <div class="gh-langs-section">
        <div class="gh-langs-title">Языки программирования</div>
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
  } catch (err) {
    console.error('GitHub stats error:', err);
    container.innerHTML = '<p style="color:#aaa;text-align:center">Не удалось загрузить статистику GitHub</p>';
  }
}

async function loadGitHubProjects() {
  const container = document.getElementById('github-projects-container');
  const filterContainer = document.getElementById('github-filter-tabs');
  if (!container) return;

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`);
    const repos = await res.json();

    // Skip the github.io repo itself for cleanliness, but keep all others
    const filtered = repos.filter(r => r.name !== `${GITHUB_USER.toLowerCase()}.github.io` || repos.length <= 1);

    // Group by category
    const groups = {};
    filtered.forEach(repo => {
      const cat = getCategory(repo);
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(repo);
    });

    const categories = Object.keys(groups);
    let activeCategory = 'all';

    // Build filter tabs
    if (filterContainer) {
      const allBtn = document.createElement('button');
      allBtn.className = 'gh-tab active';
      allBtn.setAttribute('data-cat', 'all');
      allBtn.innerHTML = `🗂 Все <span class="gh-tab-count">${filtered.length}</span>`;
      filterContainer.appendChild(allBtn);

      categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'gh-tab';
        btn.setAttribute('data-cat', cat);
        btn.innerHTML = `${CATEGORY_ICONS[cat] || '📦'} ${cat} <span class="gh-tab-count">${groups[cat].length}</span>`;
        filterContainer.appendChild(btn);
      });

      filterContainer.addEventListener('click', e => {
        const tab = e.target.closest('.gh-tab');
        if (!tab) return;
        filterContainer.querySelectorAll('.gh-tab').forEach(b => b.classList.remove('active'));
        tab.classList.add('active');
        activeCategory = tab.getAttribute('data-cat');
        renderCards(activeCategory);
      });
    }

    function renderCards(cat) {
      container.innerHTML = '';
      const toRender = cat === 'all' ? filtered : (groups[cat] || []);
      if (toRender.length === 0) {
        container.innerHTML = '<p style="color:#aaa;text-align:center;padding:30px">Нет проектов в этой категории</p>';
        return;
      }

      toRender.forEach((repo, i) => {
        const card = document.createElement('div');
        card.className = 'gh-project-card hover-in';
        card.style.animationDelay = `${i * 0.05}s`;

        const cat = getCategory(repo);
        const catIcon = CATEGORY_ICONS[cat] || '📦';

        card.innerHTML = `
          <div class="gh-card-header">
            <div class="gh-card-title-row">
              <span class="gh-card-cat-icon">${catIcon}</span>
              <a href="${repo.html_url}" target="_blank" class="gh-card-name">${repo.name}</a>
              ${repo.fork ? '<span class="gh-fork-badge">Fork</span>' : ''}
            </div>
            <p class="gh-card-desc">${repo.description || '<em style="color:#666">Нет описания</em>'}</p>
          </div>
          <div class="gh-card-footer">
            <div class="gh-card-meta">
              ${renderLangBadge(repo.language)}
              <span class="gh-meta-item">⭐ ${repo.stargazers_count}</span>
              <span class="gh-meta-item">🍴 ${repo.forks_count}</span>
            </div>
            <div class="gh-card-updated">Обновлён: ${formatDate(repo.updated_at)}</div>
          </div>
        `;

        container.appendChild(card);
      });

      // Re-init tilt on new cards
      if (window.VanillaTilt) {
        VanillaTilt.init(container.querySelectorAll('.gh-project-card'), {
          max: 10,
          speed: 3000,
          glare: true,
          'max-glare': 0.08,
        });
      }
    }

    renderCards('all');
  } catch (err) {
    console.error('GitHub projects error:', err);
    container.innerHTML = '<p style="color:#aaa;text-align:center">Не удалось загрузить проекты</p>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadGitHubStats();
  loadGitHubProjects();
});
