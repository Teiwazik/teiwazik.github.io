const TRANSLATIONS = {
    en: {
        nav_hub: "Hub",
        nav_colors: "Colors",
        nav_github: "GitHub",
        nav_projects: "Projects",
        nav_modrinth: "Modrinth",
        nav_software: "Software",
        hero_title: "Welcome to Teiwazik's Hub",
        hero_subtitle: "My projects, links and GitHub statistics",
        links_title: "My links",
        gh_stats_header: "GitHub Statistics",
        gh_stats_loading: "Loading statistics...",
        gh_stats_repos: "Repositories",
        gh_stats_stars: "Stars",
        gh_stats_forks: "Forks",
        gh_stats_followers: "Followers",
        gh_stats_following: "Following",
        gh_stats_since: "On GitHub since",
        gh_langs_title: "Programming Languages",
        gh_projects_header: "GitHub Projects",
        gh_projects_loading: "Loading projects...",
        gh_tab_all: "All",
        gh_tab_web: "Web / Desktop Apps",
        gh_tab_hardware: "Hardware / Embedded",
        gh_tab_games: "Minecraft / Gaming",
        gh_tab_other: "Other",
        gh_repo_fork: "Fork",
        gh_repo_updated: "Updated",
        modrinth_header: "Modrinth Projects",
        modrinth_view_profile: "View Profile",
        modrinth_view_project: "View Project",
        modrinth_no_bio: "No bio available.",
        modrinth_no_projects: "No projects found.",
        modrinth_failed: "Failed to load projects. Please try again later.",
        view_project: "View Project",
        no_desc: "No description",
        sw_header: "Software Tools",
        sw_image2emoji_title: "Image2Emoji",
        sw_image2emoji_desc: "Convert your images into raster art or Discord-ready emoji blocks.",
        i2e_upload: "Upload Image",
        i2e_width: "Width",
        i2e_contrast: "Contrast",
        i2e_mode: "Mode",
        i2e_mode_text: "Text (narrow)",
        i2e_mode_emoji: "Emoji (square)",
        i2e_height: "Height",
        i2e_chars: "Raster Characters",
        i2e_generate: "GENERATE",
        i2e_download: "DOWNLOAD .TXT",
        i2e_copy_title: "Discord Parts (line by line):",
        i2e_copy_btn: "Copy Part",
        i2e_copied: "COPIED!",
        i2e_copy_again: "Copy again",
        i2e_select_file: "Select a file!"
    },
    ru: {
        nav_hub: "Хаб",
        nav_colors: "Цвета",
        nav_github: "GitHub",
        nav_projects: "Проекты",
        nav_modrinth: "Modrinth",
        nav_software: "Софт",
        hero_title: "Добро пожаловать в хаб Teiwazik",
        hero_subtitle: "Мои проекты, ссылки и статистика GitHub",
        links_title: "Мои ссылки",
        gh_stats_header: "GitHub Статистика",
        gh_stats_loading: "Загрузка статистики...",
        gh_stats_repos: "Репозитории",
        gh_stats_stars: "Звезды",
        gh_stats_forks: "Форки",
        gh_stats_followers: "Подписчики",
        gh_stats_following: "Подписки",
        gh_stats_since: "На GitHub с",
        gh_langs_title: "Языки программирования",
        gh_projects_header: "GitHub Проекты",
        gh_projects_loading: "Загрузка проектов...",
        gh_tab_all: "Все",
        gh_tab_web: "Web / Desktop Apps",
        gh_tab_hardware: "Hardware / Embedded",
        gh_tab_games: "Minecraft / Gaming",
        gh_tab_other: "Другое",
        gh_repo_fork: "Форк",
        gh_repo_updated: "Обновлён",
        modrinth_header: "Modrinth Проекты",
        modrinth_view_profile: "Посмотреть профиль",
        modrinth_view_project: "Посмотреть проект",
        modrinth_no_bio: "Био отсутствует.",
        modrinth_no_projects: "Проекты не найдены.",
        modrinth_failed: "Не удалось загрузить проекты. Попробуйте позже.",
        view_project: "Посмотреть проект",
        no_desc: "Нет описания",
        sw_header: "Программные инструменты",
        sw_image2emoji_title: "Image2Emoji",
        sw_image2emoji_desc: "Превратите ваши изображения в растровое искусство или блоки эмодзи для Discord.",
        i2e_upload: "Загрузить изображение",
        i2e_width: "Ширина",
        i2e_contrast: "Контраст",
        i2e_mode: "Режим",
        i2e_mode_text: "Текст (узкий)",
        i2e_mode_emoji: "Эмодзи (квадрат)",
        i2e_height: "Высота",
        i2e_chars: "Символы растеризации",
        i2e_generate: "СГЕНЕРИРОВАТЬ",
        i2e_download: "СКАЧАТЬ .TXT",
        i2e_copy_title: "Части для Discord (построчно):",
        i2e_copy_btn: "Копировать часть",
        i2e_copied: "СКОПИРОВАНО!",
        i2e_copy_again: "Копировать заново",
        i2e_select_file: "Выбери файл!"
    }
};

let currentLang = localStorage.getItem('pref-lang') || (navigator.language.startsWith('ru') ? 'ru' : 'en');

function updateContent() {
    const langData = TRANSLATIONS[currentLang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (langData[key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = langData[key];
            } else {
                el.textContent = langData[key];
            }
        }
    });
    document.documentElement.lang = currentLang;
    
    // Update labels in github-projects.js by dispatching an event
    window.dispatchEvent(new CustomEvent('langChanged', { detail: { lang: currentLang, data: langData } }));
}

function setLanguage(lang) {
    if (TRANSLATIONS[lang]) {
        currentLang = lang;
        localStorage.setItem('pref-lang', lang);
        updateContent();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateContent();
    
    // Check if switcher exists
    const switcher = document.getElementById('lang-switcher');
    if (switcher) {
        switcher.value = currentLang;
        switcher.addEventListener('change', (e) => setLanguage(e.target.value));
    }
});

window.i18n = {
    setLanguage,
    t: (key) => TRANSLATIONS[currentLang][key] || key,
    getLang: () => currentLang
};
