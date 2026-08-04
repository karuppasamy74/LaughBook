document.addEventListener('DOMContentLoaded', () => {

    const selectedShowStr = localStorage.getItem('selectedShow');

    if (!selectedShowStr) {
        console.warn('No selectedShow found. Redirecting to index...');
        window.location.href = './index.html';
        return;
    }

    let selectedShow;
    try {
        selectedShow = JSON.parse(selectedShowStr);
    } catch (e) {
        console.error('Error parsing selectedShow', e);
        window.location.href = './index.html';
        return;
    }

    // Populate Show Summary Elements
    const titleEl = document.getElementById('bookingShowTitle');
    const categoryEl = document.getElementById('bookingShowCategory');
    const venueEl = document.getElementById('bookingShowVenue');
    const timeEl = document.getElementById('bookingShowTime');
    const dateEl = document.getElementById('bookingShowDate');
    const imageEl = document.getElementById('bookingShowImage');

    if (titleEl) titleEl.textContent = selectedShow.title || 'Untitled Show';
    if (categoryEl) categoryEl.textContent = (selectedShow.category || 'EVENT').toUpperCase();
    if (venueEl) venueEl.textContent = `${selectedShow.venue || ''}, ${selectedShow.location || ''}`;
    if (timeEl) timeEl.textContent = selectedShow.time || '';

    if (dateEl && selectedShow.date) {
        const formattedDate = new Date(selectedShow.date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        dateEl.textContent = formattedDate;
    }

    if (imageEl && selectedShow.image) {
        imageEl.src = selectedShow.image;
        imageEl.alt = selectedShow.title || 'Show Poster';
    }

    // Dynamic Tier Pricing
    const basePrice = Number(selectedShow.price) || 0;
    const standardPriceEl = document.getElementById('standardPrice');
    const premiumPriceEl = document.getElementById('premiumPrice');
    const vipPriceEl = document.getElementById('vipPrice');

    if (standardPriceEl) standardPriceEl.textContent = `$${basePrice.toFixed(2)}`;
    if (premiumPriceEl) premiumPriceEl.textContent = `$${(basePrice + 10).toFixed(2)}`;
    if (vipPriceEl) vipPriceEl.textContent = `$${(basePrice + 25).toFixed(2)}`;

    // Tier Selection Logic
    const tierCards = document.querySelectorAll('.tier-card');
    const proceedBtn = document.getElementById('proceedToSeatingBtn');

    tierCards.forEach(card => {
        card.addEventListener('click', () => {
            tierCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');

            const chosenTier = card.getAttribute('data-tier');
            localStorage.setItem('selectedTier', chosenTier);

            if (proceedBtn) {
                proceedBtn.classList.remove('disabled');
            }
        });
    });

});