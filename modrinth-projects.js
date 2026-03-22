async function renderModrinthProjects() {
  const projectsContainer = document.querySelector(".projects");
  if (!projectsContainer) return;

  const t = (key) => window.i18n ? window.i18n.t(key) : key;

  let projectsList = projectsContainer.querySelector(".projects-list");
  if (!projectsList) {
    projectsList = document.createElement("div");
    projectsList.classList.add("projects-list");
    projectsContainer.appendChild(projectsList);
  }

  try {
    const userResponse = await fetch("https://api.modrinth.com/v2/user/teiwazik");
    const userData = await userResponse.json();

    const projectsResponse = await fetch(`https://api.modrinth.com/v2/user/${userData.id}/projects`);
    const projects = await projectsResponse.json();

    projectsList.innerHTML = '';

    if (projects.length === 0) {
      projectsList.innerHTML = `<p>${t('modrinth_no_projects')}</p>`;
      return;
    }

    projects.forEach((project) => {
      const projectCard = document.createElement("div");
      projectCard.classList.add("project-card");

      const projectLink = `https://modrinth.com/${project.project_type}/${project.slug}`;

      const projectIcon = document.createElement("img");
      projectIcon.src = project.icon_url || "default-icon.png";
      projectIcon.alt = project.title;
      projectIcon.classList.add("project-icon");

      projectIcon.onload = () => {
        const colorThief = new ColorThief();
        if (projectIcon.complete && projectIcon.naturalHeight !== 0) {
          const dominantColor = colorThief.getColor(projectIcon);
          const rgbColor = `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`;
          projectIcon.style.boxShadow = `0 0 15px 4px ${rgbColor}`;
        }
      };

      const projectInfo = document.createElement("div");
      projectInfo.classList.add("project-info");

      let buttonText = t('modrinth_view_project');

      projectInfo.innerHTML = `
        <h3>${project.title}</h3>
        <p>${project.description || t('no_desc')}</p>
        <a href="${projectLink}" target="_blank" rel="noopener noreferrer" class="dynamic-button">${buttonText}</a>
      `;

      const projectStats = document.createElement("div");
      projectStats.classList.add("project-stats");

      const downloadsContainer = document.createElement("div");
      downloadsContainer.classList.add("stats-item");
      downloadsContainer.innerHTML = `
        <img src="download.svg" alt="Downloads" class="stats-icon download-icon">
        <span class="stats-count">${project.downloads || 0}</span>
      `;

      const likesContainer = document.createElement("div");
      likesContainer.classList.add("stats-item");
      likesContainer.innerHTML = `
        <img src="heart-alt-svgrepo-com.svg" alt="Likes" class="stats-icon heart-icon">
        <span class="stats-count">${project.followers || 0}</span>
      `;

      projectStats.appendChild(downloadsContainer);
      projectStats.appendChild(likesContainer);

      projectCard.appendChild(projectIcon);
      projectCard.appendChild(projectInfo);
      projectCard.appendChild(projectStats);

      projectsList.appendChild(projectCard);
    });
  } catch (error) {
    console.error("Error fetching Modrinth projects:", error);
    projectsList.innerHTML = `<p>${t('modrinth_failed')}</p>`;
  }
}

document.addEventListener("DOMContentLoaded", renderModrinthProjects);
window.addEventListener('langChanged', renderModrinthProjects);