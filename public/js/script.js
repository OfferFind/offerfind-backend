let allOffers = [];

async function fetchOffers() {
  try {
    const response = await fetch("https://offerfind-backend.onrender.com/api/get-offers")

    allOffers = await response.json();
    displayOffers(allOffers);
  } catch (error) {
    console.error('❌ Error fetching offers:', error.message);
    document.getElementById('offer-container').innerHTML = '<p style="color: red;">Failed to load offers. Please try again later.</p>';
  }
}

function displayOffers(offers) {
  const offerContainer = document.getElementById('offer-container');
  offerContainer.innerHTML = '';

  if (offers.length === 0) {
    offerContainer.innerHTML = '<p>No offers found! 🙁</p>';
    return;
  }

  offers.forEach(offer => {
    offerContainer.innerHTML += `
      <div class="offer" data-category="${offer.category}">
        <h3>${offer.source}</h3>
        <p>${offer.message}</p>
        <a class="link" href="${offer.link}" target="_blank">🔗 View Offer</a>
        <p><small>Category: ${offer.category}</small></p>
        <p><small>Posted on: ${new Date(offer.date).toLocaleString()}</small></p>
      </div>
    `;
  });
}

function filterCategory(category) {
  if (category === 'all') {
    displayOffers(allOffers);
  } else {
    const filtered = allOffers.filter(offer => offer.category === category);
    displayOffers(filtered);
  }
}

function filterProducts() {
  const searchTerm = document.getElementById('search').value.toLowerCase();
  const filtered = allOffers.filter(offer =>
    offer.message.toLowerCase().includes(searchTerm) ||
    offer.category.toLowerCase().includes(searchTerm) ||
    offer.source.toLowerCase().includes(searchTerm)
  );
  displayOffers(filtered);
}

fetchOffers();
setInterval(fetchOffers, 10000);