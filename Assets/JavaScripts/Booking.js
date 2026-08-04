document.addEventListener('DOMContentLoaded', () => {

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    let myBookings = JSON.parse(localStorage.getItem('myBookings')) || [];
    const bookingsContainer = document.getElementById('bookingsContainer');
    const receiptModalEl = document.getElementById('receiptModal');
    const receiptModal = receiptModalEl ? new bootstrap.Modal(receiptModalEl) : null;
    const receiptModalBody = document.getElementById('receiptModalBody');

    function getBookingStatus(showDateStr) {
        const showDate = new Date(showDateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return showDate >= today ? 'UPCOMING' : 'PAST';
    }

    function renderBookings(list) {
        if (!bookingsContainer) return;
        bookingsContainer.innerHTML = '';

        if (list.length === 0) {
            bookingsContainer.innerHTML = `
                <div class="empty-state text-center text-secondary py-5 border rounded-4 bg-white shadow-sm">
                    <p class="mb-0 fs-5 fw-semibold text-muted">No bookings found in this category.</p>
                    <a href="./index.html" class="btn btn-purple btn-sm mt-3 px-4 rounded-pill">Explore Shows</a>
                </div>
            `;
            return;
        }

        const cardsWrapper = document.createElement('div');
        cardsWrapper.className = 'booking-cards-wrapper d-flex flex-column gap-3';

        list.forEach((booking, index) => {
            const status = getBookingStatus(booking.showDate);
            const badgeClass = status === 'UPCOMING' ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary';
            const formattedDate = new Date(booking.showDate).toLocaleDateString('en-US', {
                weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
            });

            const cardHTML = `
                <article class="card booking-card p-4 shadow-sm">
                    <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <div>
                            <div class="d-flex align-items-center gap-2 mb-2">
                                <h3 class="h5 mb-0 fw-bold text-dark">${booking.showTitle}</h3>
                                <span class="badge ${badgeClass} rounded-1 px-2 py-1">${status}</span>
                            </div>
                            <p class="text-secondary small mb-1">
                                📅 ${formattedDate} · ${booking.showTime} · 📍 ${booking.venue}, ${booking.location}
                            </p>
                            <p class="text-secondary small mb-1">
                                🎟️ Seats: <strong class="text-dark">${booking.seats.join(', ')}</strong> · Tier: <strong class="text-purple">${booking.tier}</strong>
                            </p>
                            <p class="text-secondary small mb-0">
                                Ref: <code>#${booking.id}</code> · Total paid: <strong class="text-dark">$${Number(booking.totalAmount).toFixed(2)}</strong>
                            </p>
                        </div>
                        <div class="d-flex gap-2 flex-wrap">
                            <button class="btn btn-outline-purple rounded-pill px-3 py-2 text-nowrap btn-view-receipt" data-index="${index}">
                                📄 View Receipt
                            </button>
                            <button class="btn btn-outline-secondary rounded-pill px-3 py-2 text-nowrap btn-download-json" data-index="${index}">
                                📥 Download JSON
                            </button>
                        </div>
                    </div>
                </article>
            `;
            cardsWrapper.insertAdjacentHTML('beforeend', cardHTML);
        });

        bookingsContainer.appendChild(cardsWrapper);
    }

    renderBookings(myBookings);

    // Filters
    const filterBtns = document.querySelectorAll('.booking-filter-btn');
    let currentFilter = 'all';

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            applyFilters();
        });
    });

    const searchInput = document.getElementById('bookingSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }

    function applyFilters() {
        const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
        const filtered = myBookings.filter(booking => {
            const status = getBookingStatus(booking.showDate).toLowerCase();
            const matchesFilter = (currentFilter === 'all') || (status === currentFilter);
            const matchesSearch = !query ||
                booking.showTitle.toLowerCase().includes(query) ||
                booking.venue.toLowerCase().includes(query) ||
                booking.id.toLowerCase().includes(query);
            return matchesFilter && matchesSearch;
        });
        renderBookings(filtered);
    }

    if (bookingsContainer) {
        bookingsContainer.addEventListener('click', (e) => {
            const viewBtn = e.target.closest('.btn-view-receipt');
            if (viewBtn) {
                const idx = viewBtn.getAttribute('data-index');
                openReceiptModal(myBookings[idx]);
            }

            const downloadBtn = e.target.closest('.btn-download-json');
            if (downloadBtn) {
                const idx = downloadBtn.getAttribute('data-index');
                downloadJSON(myBookings[idx], `Ticket_${myBookings[idx].id}.json`);
            }
        });
    }

    function openReceiptModal(b) {
        if (!receiptModalBody) return;
        receiptModalBody.innerHTML = `
            <div class="ticket-card mx-auto bg-white border rounded-4 overflow-hidden shadow-sm" style="max-width: 600px;">
                <div class="p-4 text-white d-flex justify-content-between align-items-center" style="background: linear-gradient(135deg, #a855f7 0%, #7e22ce 100%);">
                    <div>
                        <span class="badge bg-white text-purple fw-bold mb-1">LAUGHBOOK PASS</span>
                        <h2 class="h4 fw-bold mb-0 text-white">${b.showTitle}</h2>
                    </div>
                    <div><span class="fs-4 fw-bold text-white">${b.tier}</span></div>
                </div>
                <div class="p-4 text-dark">
                    <div class="row g-3">
                        <div class="col-7">
                            <div class="small text-muted text-uppercase">Attendee</div>
                            <div class="fw-bold text-dark mb-2">${currentUser ? currentUser.name.toUpperCase() : 'USER'}</div>
                            <div class="small text-muted text-uppercase">Venue</div>
                            <div class="fw-semibold text-dark mb-2">${b.venue}, ${b.location}</div>
                            <div class="small text-muted text-uppercase">Date & Time</div>
                            <div class="fw-semibold text-dark mb-2">${b.showDate} at ${b.showTime}</div>
                            <div class="small text-muted text-uppercase">Allocated Seats</div>
                            <div class="fw-bold text-purple fs-5">${b.seats.join(', ')}</div>
                        </div>
                        <div class="col-5 text-center d-flex flex-column align-items-center justify-content-center border-start ps-3">
                            <div class="qr-placeholder p-2 bg-white border rounded-3 mb-2">
                                <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 0H40V40H0V0ZM10 10V30H30V10H10Z" fill="#1A1A1A"/>
                                    <path d="M60 0H100V40H60V0ZM70 10V30H90V10H70Z" fill="#1A1A1A"/>
                                    <path d="M0 60H40V100H0V60ZM10 70V90H30V70H10Z" fill="#1A1A1A"/>
                                    <path d="M50 50H60V60H50V50ZM70 50H90V60H70V50ZM50 70H70V90H50V70ZM80 80H100V100H80V80Z" fill="#1A1A1A"/>
                                </svg>
                            </div>
                            <div class="extra-small text-muted font-monospace">${b.id}</div>
                        </div>
                    </div>
                </div>
                <div class="bg-light p-3 text-center border-top small text-muted">
                    No Cash Back / Non-refundable • Total Paid: $${Number(b.totalAmount).toFixed(2)} (${b.paymentMethod})
                </div>
            </div>
        `;
        receiptModal?.show();
    }

    const exportAllBtn = document.getElementById('exportAllBtn');
    if (exportAllBtn) {
        exportAllBtn.addEventListener('click', () => {
            if (myBookings.length === 0) {
                alert('No bookings available to export.');
                return;
            }
            downloadJSON(myBookings, 'All_LaughBook_Bookings.json');
        });
    }

    function downloadJSON(data, filename) {
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

});