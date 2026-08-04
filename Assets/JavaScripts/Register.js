document.addEventListener('DOMContentLoaded', () => {

    const registerForm = document.getElementById('registerForm');

    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const name = document.getElementById('regName').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;    

            // Rule Password Validation

            if(password.length < 8){
                alert('Password must be at least 8 characters long.');
                return;
            };
            if(password !== confirmPassword){
                alert('Passwords do not match! Please verify both password fields.');
                return;
            }

            // Check if email is already registered

            const ExistingUsers = JSON.parse(localStorage.getItem('users')) || [];
            const Existuser = ExistingUsers.find(user => user.email === email);
            if(Existuser){
                alert('An account with this email already exists! Redirecting to Login....');
                window.location.href = './login.html';
                return;
            }

            // Save new user to localStorage

            const newUser = {

                id: 'USER-'+Date.now(),
                name: name,
                email: email,
                password: password
            };

            ExistingUsers.push(newUser);
            localStorage.setItem('users', JSON.stringify(ExistingUsers));

            localStorage.setItem('currentUser', JSON.stringify(newUser));

            alert('Registration successful! Redirecting to Home Page...');
            window.location.href = './index.html';
        });
    }

});
