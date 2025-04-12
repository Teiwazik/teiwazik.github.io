// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", async () => {
  const projectsContainer = document.querySelector(".projects");

  // Check if the title already exists
  if (!projectsContainer.querySelector("h2")) {
    // Add the title to the projects list
    const title = document.createElement("h2");
    title.textContent = "Discover my Modrinth projects";
    projectsContainer.appendChild(title);
  }

  // Create container for project cards
  let projectsList = projectsContainer.querySelector(".projects-list");
  if (!projectsList) {
    projectsList = document.createElement("div");
    projectsList.classList.add("projects-list");
    projectsContainer.appendChild(projectsList);
  }

  try {
    // Fetch user data from Modrinth API
    const userResponse = await fetch("https://api.modrinth.com/v2/user/teiwazik");
    const userData = await userResponse.json();

    // Fetch projects data using the user ID
    const projectsResponse = await fetch(`https://api.modrinth.com/v2/user/${userData.id}/projects`);
    const projects = await projectsResponse.json();

    // Check if there are projects
    if (projects.length === 0) {
      projectsList.innerHTML = "<p>No projects found.</p>";
      return;
    }

    // Dynamically create project cards
    projects.forEach((project) => {
      const projectCard = document.createElement("div");
      projectCard.classList.add("project-card");

      // Construct the project link using slug and project_type
      const projectLink = `https://modrinth.com/${project.project_type}/${project.slug}`;

      // Create the project icon
      const projectIcon = document.createElement("img");
      projectIcon.src = project.icon_url || "default-icon.png";
      projectIcon.alt = project.title;
      projectIcon.classList.add("project-icon");

      // Extract the dominant color from the icon
      projectIcon.onload = () => {
        const colorThief = new ColorThief();
        if (projectIcon.complete && projectIcon.naturalHeight !== 0) {
          const dominantColor = colorThief.getColor(projectIcon);
          const rgbColor = `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`;

          // Apply the glow effect
          projectIcon.style.boxShadow = `0 0 15px 5px ${rgbColor}`;
        }
      };

      // Create the project info
      const projectInfo = document.createElement("div");
      projectInfo.classList.add("project-info");

      // Determine the button text based on the project type
      let buttonText = "Discover project";
      if (project.project_type === "mod") {
        buttonText = "Discover mod";
      } else if (project.project_type === "resourcepack") {
        buttonText = "Discover resourcepack";
      } else if (project.project_type === "plugin") {
        buttonText = "Discover plugin";
      }

      // Add the project info content
      projectInfo.innerHTML = `
        <h3>${project.title}</h3>
        <p>${project.description || "No description available."}</p>
        <a href="${projectLink}" target="_blank" rel="noopener noreferrer" class="dynamic-button">${buttonText}</a>
      `;

      // Create the stats container
      const projectStats = document.createElement("div");
      projectStats.classList.add("project-stats");

      // Add download icon and count
      const downloadsContainer = document.createElement("div");
      downloadsContainer.classList.add("stats-item");

      const downloadsIcon = document.createElement("img");
      downloadsIcon.src = "download.svg"; // Replace with your download icon path
      downloadsIcon.alt = "Downloads";
      downloadsIcon.classList.add("stats-icon", "download-icon");

      const downloadsCount = document.createElement("span");
      downloadsCount.textContent = project.downloads || 0; // Display the number of downloads
      downloadsCount.classList.add("stats-count");

      downloadsContainer.appendChild(downloadsIcon);
      downloadsContainer.appendChild(downloadsCount);

      // Add likes icon and count
      const likesContainer = document.createElement("div");
      likesContainer.classList.add("stats-item");

      const likesIcon = document.createElement("img");
      likesIcon.src = "heart-alt-svgrepo-com.svg"; // Replace with your like icon path
      likesIcon.alt = "Likes";
      likesIcon.classList.add("stats-icon", "heart-icon");

      const likesCount = document.createElement("span");
      likesCount.textContent = project.followers || 0; // Display the number of likes
      likesCount.classList.add("stats-count");

      likesContainer.appendChild(likesIcon);
      likesContainer.appendChild(likesCount);

      // Append stats items to the stats container
      projectStats.appendChild(downloadsContainer);
      projectStats.appendChild(likesContainer);

      // Append the icon, info, and stats to the card
      projectCard.appendChild(projectIcon);
      projectCard.appendChild(projectInfo);
      projectCard.appendChild(projectStats);

      // Append the card to the projects list
      projectsList.appendChild(projectCard);
    });
  } catch (error) {
    console.error("Error fetching Modrinth projects:", error);
    projectsContainer.innerHTML += "<p>Failed to load projects. Please try again later.</p>";
  }
});