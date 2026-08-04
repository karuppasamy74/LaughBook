document.addEventListener('DOMContentLoaded', () => {

    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const displayProfileName = document.getElementById('displayProfileName');
    const displayProfileEmail = document.getElementById('displayProfileEmail');
    const profileNameInput = document.getElementById('profileName');
    const profileEmailInput = document.getElementById('profileEmail');
    const avatarCircle = document.getElementById('avatarCircle');
    const navAvatarContainer = document.getElementById('profileAvatarContainer');

    function updateAvatarUI(imgData, name) {
        const initial = (name || 'U').charAt(0).toUpperCase();

        if (imgData && avatarCircle) {
            avatarCircle.innerHTML = `<img src="${imgData}" alt="Profile" class="w-100 h-100 object-fit-cover rounded-circle">`;
        } else if (avatarCircle) {
            avatarCircle.innerHTML = `<span>${initial}</span>`;
        }

        if (imgData && navAvatarContainer) {
            navAvatarContainer.innerHTML = `<img src="${imgData}" alt="Profile" class="w-100 h-100 object-fit-cover rounded-circle">`;
        } else if (navAvatarContainer) {
            navAvatarContainer.innerHTML = `<span>${initial}</span>`;
        }
    }

    function loadProfile() {
        if (!currentUser) return;
        const name = currentUser.name || 'User';
        const email = currentUser.email || 'user@example.com';

        if (displayProfileName) displayProfileName.textContent = name;
        if (displayProfileEmail) displayProfileEmail.textContent = email;
        if (profileNameInput) profileNameInput.value = name;
        if (profileEmailInput) profileEmailInput.value = email;

        updateAvatarUI(currentUser.profileImg, name);
    }

    loadProfile();

    // Image Upload Handler
    const triggerUploadBtn = document.getElementById('triggerUploadBtn');
    const imageUploadInput = document.getElementById('imageUploadInput');

    if (triggerUploadBtn && imageUploadInput) {
        triggerUploadBtn.addEventListener('click', () => imageUploadInput.click());

        imageUploadInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function (event) {
                const base64Img = event.target.result;
                currentUser.profileImg = base64Img;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));

                let users = JSON.parse(localStorage.getItem('users')) || [];
                users = users.map(u => u.email === currentUser.email ? { ...u, profileImg: base64Img } : u);
                localStorage.setItem('users', JSON.stringify(users));

                updateAvatarUI(base64Img, currentUser.name);
                alert('Profile picture updated successfully!');
            };
            reader.readAsDataURL(file);
        });
    }

    // Load Stats
    function loadBookingStats() {
        const myBookings = JSON.parse(localStorage.getItem('myBookings')) || [];
        const countEl = document.getElementById('statTotalBookings');
        const spentEl = document.getElementById('statTotalSpent');

        if (countEl) countEl.textContent = myBookings.length;
        if (spentEl) {
            const totalSpent = myBookings.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0);
            spentEl.textContent = `$${totalSpent.toFixed(2)}`;
        }
    }

    loadBookingStats();

    // Save Changes
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', () => {
            const newName = profileNameInput.value.trim();
            const newEmail = profileEmailInput.value.trim();

            if (!newName || !newEmail) {
                alert('Name and Email cannot be empty.');
                return;
            }

            const currentPass = document.getElementById('currentPassword')?.value;
            const newPass = document.getElementById('newPassword')?.value;
            const confirmPass = document.getElementById('confirmPassword')?.value;

            if (currentPass || newPass || confirmPass) {
                if (currentPass !== currentUser.password) {
                    alert('Current password does not match.');
                    return;
                }
                if (newPass.length < 4) {
                    alert('New password must be at least 4 characters.');
                    return;
                }
                if (newPass !== confirmPass) {
                    alert('New passwords do not match.');
                    return;
                }
                currentUser.password = newPass;
            }

            currentUser.name = newName;
            currentUser.email = newEmail;

            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            let users = JSON.parse(localStorage.getItem('users')) || [];
            users = users.map(u => u.id === currentUser.id ? currentUser : u);
            localStorage.setItem('users', JSON.stringify(users));

            loadProfile();
            alert('Profile saved successfully!');
        });
    }

    // Theme Switcher Logic
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('appTheme') || 'light';

    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark-mode');
        document.body.classList.add('dark-mode');
        if (themeToggle) themeToggle.checked = true;
    }

    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            if (themeToggle.checked) {
                document.documentElement.classList.add('dark-mode');
                document.body.classList.add('dark-mode');
                localStorage.setItem('appTheme', 'dark');
            } else {
                document.documentElement.classList.remove('dark-mode');
                document.body.classList.remove('dark-mode');
                localStorage.setItem('appTheme', 'light');
            }
        });
    }

    // Logout
    const logoutBtn = document.querySelector('.btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to log out?')) {
                localStorage.removeItem('currentUser');
                window.location.href = './register.html';
            }
        });
    }

});