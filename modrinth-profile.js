// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", async () => {
  const profileContainer = document.querySelector("#modrinth-profile-container");

  // Ensure the container exists before proceeding
  if (!profileContainer) {
    console.error("Profile container not found!");
    return;
  }

  try {
    // Fetch user data from Modrinth API
    const userResponse = await fetch("https://api.modrinth.com/v2/user/teiwazik");
    const userData = await userResponse.json();

    // Create the profile card
    const profileCard = document.createElement("div");
    profileCard.classList.add("project-card");

    // Add profile content
    profileCard.innerHTML = `
      <img src="${userData.avatar_url || 'default-avatar.png'}" alt="${userData.username}" class="project-icon">
      <div class="project-info">
        <h3>${userData.name || userData.username}</h3>
        <p>${userData.bio || "No bio available."}</p>
        <a href="https://modrinth.com/user/${userData.username}" target="_blank" rel="noopener noreferrer" class="dynamic-button">View Profile</a>
      </div>
    `;

    // Append the profile card to the container
    profileContainer.appendChild(profileCard);
  } catch (error) {
    console.error("Error fetching Modrinth profile:", error);
    profileContainer.innerHTML = "<p>Failed to load profile. Please try again later.</p>";
  }
});