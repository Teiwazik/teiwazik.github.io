document.addEventListener("DOMContentLoaded", async () => {
  const profileContainer = document.querySelector("#modrinth-profile-container");

  if (!profileContainer) {
    console.error("Profile container not found!");
    return;
  }

  try {
    const userResponse = await fetch("https://api.modrinth.com/v2/user/teiwazik");
    const userData = await userResponse.json();

    const profileCard = document.createElement("div");
    profileCard.classList.add("project-card");

    profileCard.innerHTML = `
      <img src="${userData.avatar_url || 'default-avatar.png'}" alt="${userData.username}" class="project-icon">
      <div class="project-info">
        <h3>${userData.name || userData.username}</h3>
        <p>${userData.bio || "No bio available."}</p>
        <a href="https://modrinth.com/user/${userData.username}" target="_blank" rel="noopener noreferrer" class="dynamic-button">View Profile</a>
      </div>
    `;

    profileContainer.appendChild(profileCard);
  } catch (error) {
    console.error("Error fetching Modrinth profile:", error);
    profileContainer.innerHTML = "<p>Failed to load profile. Please try again later.</p>";
  }
});