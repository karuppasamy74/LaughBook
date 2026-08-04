document.addEventListener('DOMContentLoaded', async () => {

  const showContainer = document.getElementById('showContainer');
  const totalcount = document.getElementById('total-count');
  const titleHeader = document.getElementById('showcontainerTitle');
  const searchInput = document.querySelector('.custom-search-input');
  const sortselect = document.querySelector('.custom-sort-select');

  let showlist = [];

  /* --- 1. RENDER CARD GRID --- */
  function renderCards(shows) {
    if (!showContainer) return;
    showContainer.innerHTML = '';

    if (totalcount) {
      totalcount.textContent = shows.length;
    }

    if (shows.length === 0) {
      showContainer.innerHTML = `
        <div class="col-12 text-center text-secondary py-5">
            <h5>No shows found matching your filter.</h5>
        </div>
      `;
      return;
    }

    shows.forEach(show => {
      const formattedDate = new Date(show.date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
      const dateDisplay = `${formattedDate} · ${show.time}`;

      const cardHTML = `
        <div class="col-12 col-md-6 col-lg-4">
            <div class="card bg-dark-card border-secondary-subtle h-100 overflow-hidden position-relative shadow-sm">
                <span class="category-badge">${show.category}</span>
                <button class="wishlist-btn" title="Add to Wishlist">❤️</button>
                <img src="${show.image}" class="card-img-top event-img" alt="${show.title}">
                <div class="card-body p-3 d-flex flex-column justify-content-between">
                    <div>
                        <h3 class="h6 fw-bold text-dark mb-2">${show.title}</h3>
                        <p class="text-secondary extra-small mb-1">📅 ${dateDisplay}</p>
                        <p class="text-secondary extra-small mb-3">📍 ${show.venue}, ${show.location}</p>
                    </div>
                    <div class="d-flex justify-content-between align-items-center pt-2 border-top border-secondary border-opacity-25">
                        <span class="fw-bold price-highlight">$${Number(show.price).toFixed(2)}</span>
                        <!-- ATTACHED DATA-ID AND BOOK-BTN CLASS HERE -->
                        <button class="btn btn-purple btn-sm px-3 fw-semibold book-btn" data-id="${show.id}">Book Seats</button>
                    </div>
                </div>
            </div>
        </div>
      `;
      showContainer.insertAdjacentHTML('beforeend', cardHTML);
    });
  }

  /* --- 2. FETCH JSON DATA --- */
  async function fetchData() {
    try {
      const response = await fetch('./Assets/Json/data.json');
      if (!response.ok) throw new Error('Network error');
      showlist = await response.json();
      filterandRenderShows();
    } catch (error) {
      console.error('Error fetching JSON data:', error);
      if (showContainer) {
        showContainer.innerHTML = `<div class="col-12 text-center text-danger py-5"><h5>Failed to load shows data. Please check data.json path.</h5></div>`;
      }
    }
  }

  /* --- 3. FILTER, SEARCH & SORT --- */
  function filterandRenderShows() {
    const activeFilterButton = document.querySelector('.filter-pill.active');
    const selectedCategory = activeFilterButton ? activeFilterButton.getAttribute('data-filter').toLowerCase() : 'all';

    if (titleHeader) {
      titleHeader.textContent = selectedCategory === 'all'
        ? 'All Upcoming Shows'
        : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Shows`;
    }

    const searchQuery = searchInput ? searchInput.value.trim().toLowerCase() : '';

    let filteredShows = showlist.filter(show => {
      const matchesCategory = selectedCategory === 'all' || (show.category && show.category.toLowerCase() === selectedCategory);
      const matchesSearch = !searchQuery ||
        show.title.toLowerCase().includes(searchQuery) ||
        (show.venue && show.venue.toLowerCase().includes(searchQuery)) ||
        (show.location && show.location.toLowerCase().includes(searchQuery));
      return matchesCategory && matchesSearch;
    });

    const sortValue = sortselect ? sortselect.value : 'featured';
    if (sortValue === 'price-low') filteredShows.sort((a, b) => Number(a.price) - Number(b.price));
    else if (sortValue === 'price-high') filteredShows.sort((a, b) => Number(b.price) - Number(a.price));
    else if (sortValue === 'date-soonest') filteredShows.sort((a, b) => new Date(a.date) - new Date(b.date));
    else if (sortValue === 'featured') filteredShows.sort((a, b) => (b.featured === true ? 1 : 0) - (a.featured === true ? 1 : 0));

    renderCards(filteredShows);
  }

  /* --- 4. EVENT LISTENERS --- */
  const filterButtons = document.querySelectorAll('.filter-pill');
  filterButtons.forEach(pill => {
    pill.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      pill.classList.add('active');
      filterandRenderShows();
    });
  });

  if (searchInput) {
    const searchform = searchInput.closest('form');
    if (searchform) searchform.addEventListener('submit', (e) => e.preventDefault());
    searchInput.addEventListener('input', filterandRenderShows);
  }

  if (sortselect) {
    sortselect.addEventListener('change', filterandRenderShows);
  }

  /* --- 5. BOOK SEATS CLICK LISTENER --- */
  if (showContainer) {
    showContainer.addEventListener('click', (event) => {
      const bookBtn = event.target.closest('.book-btn');
      if (bookBtn) {
        const showId = Number(bookBtn.getAttribute('data-id'));
        const selectedShow = showlist.find(item => item.id === showId);

        if (selectedShow) {
          // Store selected show object in LocalStorage
          localStorage.setItem('selectedShow', JSON.stringify(selectedShow));
          
          // Redirect to Book Now page
          window.location.href = './booknow.html';
        }
      }
    });
  }

  await fetchData();
});