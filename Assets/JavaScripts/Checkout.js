document.addEventListener('DOMContentLoaded', () => {

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const bookingSummary = JSON.parse(localStorage.getItem('bookingSummary'));

    if (!currentUser) {
        window.location.href = './register.html';
        return;
    }

    if (!bookingSummary) {
        window.location.href = './index.html';
        return;
    }

    // Auto-fill user information
    const custName = document.getElementById('custName');
    const custEmail = document.getElementById('custEmail');
    if (custName) custName.value = currentUser.name || 'User';
    if (custEmail) custEmail.value = currentUser.email || 'user@example.com';

    // Populate order summary
    const showTitle = document.getElementById('checkoutShowTitle');
    const showVenue = document.getElementById('checkoutShowVenue');
    const showTime = document.getElementById('checkoutShowTime');
    const checkoutTier = document.getElementById('checkoutTier');
    const checkoutSeats = document.getElementById('checkoutSeats');
    const checkoutTotal = document.getElementById('checkoutTotal');

    if (showTitle) showTitle.textContent = bookingSummary.show.title;
    if (showVenue) showVenue.textContent = `${bookingSummary.show.venue}, ${bookingSummary.show.location}`;
    if (showTime) showTime.textContent = `${bookingSummary.show.date} · ${bookingSummary.show.time}`;
    if (checkoutTier) checkoutTier.textContent = bookingSummary.tier.toUpperCase();
    if (checkoutSeats) checkoutSeats.textContent = bookingSummary.seats.join(', ');
    if (checkoutTotal) checkoutTotal.textContent = `$${Number(bookingSummary.totalAmount).toFixed(2)}`;

    const confirmBookingBtn = document.getElementById('confirmBookingBtn');
    const custPhoneInput = document.getElementById('custPhone');
    const termsModalElement = document.getElementById('termsModal');
    const termsModal = termsModalElement ? new bootstrap.Modal(termsModalElement) : null;

    if (confirmBookingBtn) {
        confirmBookingBtn.addEventListener('click', () => {
            if (!custPhoneInput || !custPhoneInput.value.trim()) {
                alert('Please enter your phone number to proceed.');
                custPhoneInput?.focus();
                return;
            }
            termsModal?.show();
        });
    }

    const agreeAndPayBtn = document.getElementById('agreeAndPayBtn');
    if (agreeAndPayBtn) {
        agreeAndPayBtn.addEventListener('click', () => {
            termsModal?.hide();

            const randomRef = 'REF-' + Math.floor(100000 + Math.random() * 900000);
            const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'UPI';

            const newBooking = {
                id: randomRef,
                showTitle: bookingSummary.show.title,
                category: bookingSummary.show.category,
                venue: bookingSummary.show.venue,
                location: bookingSummary.show.location,
                showDate: bookingSummary.show.date,
                showTime: bookingSummary.show.time,
                image: bookingSummary.show.image,
                tier: bookingSummary.tier.toUpperCase(),
                seats: bookingSummary.seats,
                totalAmount: bookingSummary.totalAmount,
                paymentMethod: selectedPayment,
                phone: custPhoneInput.value,
                bookedAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
            };

            // Save to localStorage under 'myBookings'
            const existingBookings = JSON.parse(localStorage.getItem('myBookings')) || [];
            existingBookings.unshift(newBooking);
            localStorage.setItem('myBookings', JSON.stringify(existingBookings));

            // Populate Printable Ticket
            document.getElementById('ticketTitle').textContent = newBooking.showTitle;
            document.getElementById('ticketTier').textContent = newBooking.tier;
            document.getElementById('ticketAttendee').textContent = currentUser.name.toUpperCase();
            document.getElementById('ticketVenue').textContent = `${newBooking.venue}, ${newBooking.location}`;
            document.getElementById('ticketDateTime').textContent = `${newBooking.showDate} at ${newBooking.showTime}`;
            document.getElementById('ticketSeats').textContent = newBooking.seats.join(', ');
            document.getElementById('ticketRefNo').textContent = newBooking.id;

            document.getElementById('checkoutFormSection')?.classList.add('d-none');
            document.getElementById('ticketPassSection')?.classList.remove('d-none');
        });
    }

});