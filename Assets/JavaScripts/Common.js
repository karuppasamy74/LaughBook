/* ===================================================
   COMMON GLOBAL JS (Theme Persistence & Auth Guard)
   =================================================== */

// Apply stored theme on initial page load immediately
(function initTheme() {
    const savedTheme = localStorage.getItem('appTheme') || 'light';
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark-mode');
        document.body?.classList.add('dark-mode');
    } else {
        document.documentElement.classList.remove('dark-mode');
        document.body?.classList.remove('dark-mode');
    }
})();

document.addEventListener('DOMContentLoaded', () => {

    /* --- AUTH GUARD --- */
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const isPublicPage = window.location.pathname.includes('register.html') || window.location.pathname.includes('login.html');

    if (!currentUser && !isPublicPage) {
        window.location.href = './register.html';
        return;
    }

    /* --- GLOBAL USER AVATAR & NAME SYNC --- */
    if (currentUser) {
        const userNameElement = document.getElementById('user-display-name');
        if (userNameElement) {
            userNameElement.textContent = currentUser.name.toUpperCase();
        }

        const avatarContainer = document.getElementById('profileAvatarContainer');
        const avatarText = document.getElementById('profileAvatarText');

        if (currentUser.profileImg && avatarContainer) {
            avatarContainer.innerHTML = `<img src="${currentUser.profileImg}" alt="${currentUser.name}" class="w-100 h-100 object-fit-cover rounded-circle">`;
        } else if (avatarText && currentUser.name) {
            avatarText.textContent = currentUser.name.charAt(0).toUpperCase();
        }
    }

});