document.addEventListener("DOMContentLoaded", async () => {
  const projectsContainer = document.querySelector(".projects");

  if (!projectsContainer.querySelector("h2")) {
    const title = document.createElement("h2");
    title.textContent = "Discover my Modrinth projects";
    projectsContainer.appendChild(title);
  }

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

    if (projects.length === 0) {
      projectsList.innerHTML = "<p>No projects found.</p>";
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

          projectIcon.style.boxShadow = `0 0 15px 5px ${rgbColor}`;
        }
      };

      const projectInfo = document.createElement("div");
      projectInfo.classList.add("project-info");

      let buttonText = "Discover project";
      if (project.project_type === "mod") {
        buttonText = "Discover mod";
      } else if (project.project_type === "resourcepack") {
        buttonText = "Discover resourcepack";
      } else if (project.project_type === "plugin") {
        buttonText = "Discover plugin";
      }

      projectInfo.innerHTML = `
        <h3>${project.title}</h3>
        <p>${project.description || "No description available."}</p>
        <a href="${projectLink}" target="_blank" rel="noopener noreferrer" class="dynamic-button">${buttonText}</a>
      `;

      const projectStats = document.createElement("div");
      projectStats.classList.add("project-stats");

      const downloadsContainer = document.createElement("div");
      downloadsContainer.classList.add("stats-item");

      const downloadsIcon = document.createElement("img");
      downloadsIcon.src = "download.svg"; 
      downloadsIcon.alt = "Downloads";
      downloadsIcon.classList.add("stats-icon", "download-icon");

      const downloadsCount = document.createElement("span");
      downloadsCount.textContent = project.downloads || 0;
      downloadsCount.classList.add("stats-count");

      downloadsContainer.appendChild(downloadsIcon);
      downloadsContainer.appendChild(downloadsCount);

      const likesContainer = document.createElement("div");
      likesContainer.classList.add("stats-item");

      const likesIcon = document.createElement("img");
      likesIcon.src = "heart-alt-svgrepo-com.svg"; 
      likesIcon.alt = "Likes";
      likesIcon.classList.add("stats-icon", "heart-icon");

      const likesCount = document.createElement("span");
      likesCount.textContent = project.followers || 0;
      likesCount.classList.add("stats-count");

      likesContainer.appendChild(likesIcon);
      likesContainer.appendChild(likesCount);

      projectStats.appendChild(downloadsContainer);
      projectStats.appendChild(likesContainer);

      projectCard.appendChild(projectIcon);
      projectCard.appendChild(projectInfo);
      projectCard.appendChild(projectStats);

      projectsList.appendChild(projectCard);
    });
  } catch (error) {
    console.error("Error fetching Modrinth projects:", error);
    projectsContainer.innerHTML += "<p>Failed to load projects. Please try again later.</p>";
  }
});