document.addEventListener('DOMContentLoaded', () => {

    /* 1. AUTO-FILL CURRENT USER DATA IF LOGGED IN */
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const contactNameInput = document.getElementById('contactName');
    const contactEmailInput = document.getElementById('contactEmail');

    if (currentUser) {
        if (contactNameInput) contactNameInput.value = currentUser.name || '';
        if (contactEmailInput) contactEmailInput.value = currentUser.email || '';
    }

    /* 2. SUBMIT FORM HANDLER */
    const contactForm = document.getElementById('contactForm');
    const contactSuccessAlert = document.getElementById('contactSuccessAlert');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Show success message alert
            if (contactSuccessAlert) {
                contactSuccessAlert.classList.remove('d-none');
            }

            // Clear subject & message inputs
            const subjectInput = document.getElementById('contactSubject');
            const messageInput = document.getElementById('contactMessage');

            if (subjectInput) subjectInput.value = '';
            if (messageInput) messageInput.value = '';

            // Auto-hide alert after 5 seconds
            setTimeout(() => {
                if (contactSuccessAlert) {
                    contactSuccessAlert.classList.add('d-none');
                }
            }, 5000);
        });
    }

});