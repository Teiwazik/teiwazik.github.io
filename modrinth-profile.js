async function renderModrinthProfile() {
  const profileContainer = document.querySelector("#modrinth-profile-container");
  if (!profileContainer) return;

  const t = (key) => window.i18n ? window.i18n.t(key) : key;

  try {
    const userResponse = await fetch("https://api.modrinth.com/v2/user/teiwazik");
    const userData = await userResponse.json();

    profileContainer.innerHTML = `
      <div class="project-card" data-tilt data-tilt-max="15" data-tilt-speed="3000">
        <img src="${userData.avatar_url || 'default-avatar.png'}" alt="${userData.username}" class="project-icon">
        <div class="project-info">
          <h3>${userData.name || userData.username}</h3>
          <p>${userData.bio || t('modrinth_no_bio')}</p>
          <a href="https://modrinth.com/user/${userData.username}" target="_blank" rel="noopener noreferrer" class="dynamic-button">${t('modrinth_view_profile')}</a>
        </div>
      </div>
    `;
    
    if (window.VanillaTilt) {
      VanillaTilt.init(profileContainer.querySelectorAll('.project-card'), { max: 10, speed: 3000 });
    }
  } catch (error) {
    console.error("Error fetching Modrinth profile:", error);
    profileContainer.innerHTML = `<p>${t('modrinth_failed')}</p>`;
  }
}

document.addEventListener("DOMContentLoaded", renderModrinthProfile);
window.addEventListener('langChanged', renderModrinthProfile);