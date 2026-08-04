document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (currentUser) {
        window.location.href = './index.html';
        return;
    }


    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;

            const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
            const user = existingUsers.find(user => user.email === email && user.password === password);

            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                alert(`Welcome back, ${user.name}!`);
                window.location.href = './index.html';
            } 
            else if (!existingUsers.some(user => user.email === email)) {
                alert('No account found with this email. Please register first.');
                window.location.href = './register.html';
            }
            else {
                alert('Invalid email or password. Please try again or register first.');
            }
        });
    }
});