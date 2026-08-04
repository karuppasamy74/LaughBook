document.addEventListener('DOMContentLoaded', () => {

    const selectedShow = JSON.parse(localStorage.getItem('selectedShow'));
    const selectedTier = localStorage.getItem('selectedTier') || 'standard';

    if (!selectedShow) {
        window.location.href = './index.html';
        return;
    }

    let basePrice = Number(selectedShow.price);
    if (selectedTier === 'vip') basePrice += 25;
    else if (selectedTier === 'premium') basePrice += 10;

    // Sidebar Summary Header
    const summaryShowTitle = document.getElementById('summaryShowTitle');
    const summaryShowDetails = document.getElementById('summaryShowDetails');
    const summaryTierBadge = document.getElementById('summaryTierBadge');

    if (summaryShowTitle) summaryShowTitle.textContent = selectedShow.title;
    if (summaryShowDetails) summaryShowDetails.textContent = `${selectedShow.venue} · ${selectedShow.time}`;
    if (summaryTierBadge) summaryTierBadge.textContent = `${selectedTier.toUpperCase()} TIER ($${basePrice.toFixed(2)}/seat)`;

    // Mock already booked seats
    const alreadyBookedSeats = ['T1-S1', 'T1-S2', 'T3-S5', 'T6-S3', 'T7-S1', 'T10-S4', 'T12-S2'];
    let selectedSeats = [];

    const tablesContainer = document.getElementById('tablesContainer');

    function renderSeatingGrid() {
        if (!tablesContainer) return;
        tablesContainer.innerHTML = '';

        for (let t = 1; t <= 12; t++) {
            let seatsHTML = '';
            for (let s = 1; s <= 5; s++) {
                const seatId = `T${t}-S${s}`;
                const isBooked = alreadyBookedSeats.includes(seatId);
                const isSelected = selectedSeats.includes(seatId);

                seatsHTML += `
                    <button type="button" 
                            class="seat-btn ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : ''}" 
                            data-seat-id="${seatId}" 
                            data-seat-index="${s}"
                            ${isBooked ? 'disabled' : ''}>
                        ${s}
                    </button>
                `;
            }

            const tableCard = `
                <div class="col d-flex justify-content-center">
                    <div class="table-wrapper">
                        <div class="table-center">T-${t}</div>
                        ${seatsHTML}
                    </div>
                </div>
            `;
            tablesContainer.insertAdjacentHTML('beforeend', tableCard);
        }
    }

    renderSeatingGrid();

    if (tablesContainer) {
        tablesContainer.addEventListener('click', (e) => {
            const seatBtn = e.target.closest('.seat-btn');
            if (!seatBtn || seatBtn.classList.contains('booked')) return;

            const seatId = seatBtn.getAttribute('data-seat-id');

            if (selectedSeats.includes(seatId)) {
                selectedSeats = selectedSeats.filter(id => id !== seatId);
                seatBtn.classList.remove('selected');
            } else {
                selectedSeats.push(seatId);
                seatBtn.classList.add('selected');
            }

            updateCheckoutSummary();
        });
    }

    const totalCountEl = document.getElementById('selectedSeatsCount');
    const seatsListEl = document.getElementById('selectedSeatsList');
    const totalPriceEl = document.getElementById('totalPrice');
    const checkoutBtn = document.getElementById('checkoutBtn');

    function updateCheckoutSummary() {
        const count = selectedSeats.length;
        const total = count * basePrice;

        if (totalCountEl) totalCountEl.textContent = `${count} ${count === 1 ? 'Seat' : 'Seats'}`;
        if (totalPriceEl) totalPriceEl.textContent = `$${total.toFixed(2)}`;

        if (count > 0) {
            if (seatsListEl) seatsListEl.textContent = selectedSeats.join(', ');
            if (checkoutBtn) checkoutBtn.removeAttribute('disabled');
        } else {
            if (seatsListEl) seatsListEl.textContent = 'No seats selected yet.';
            if (checkoutBtn) checkoutBtn.setAttribute('disabled', 'true');
        }
    }

    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            selectedSeats = [];
            renderSeatingGrid();
            updateCheckoutSummary();
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (selectedSeats.length === 0) return;

            const bookingData = {
                show: selectedShow,
                tier: selectedTier,
                seats: selectedSeats,
                totalAmount: selectedSeats.length * basePrice
            };

            localStorage.setItem('bookingSummary', JSON.stringify(bookingData));
            window.location.href = './checkout.html';
        });
    }

});