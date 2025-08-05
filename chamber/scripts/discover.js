const cardsContainer = document.getElementById("card-grid");
const visitMessage = document.getElementById("visit-message");

async function loadDiscoverItems() {
  try {
    const response = await fetch("data/discover.json");
    const items = await response.json();

    items.forEach(item => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <h2>${item.title}</h2>
        <figure>
          <img src="${item.image}" alt="${item.title} - ${item.description}" width="300" height="200" loading="lazy">
        </figure>
        <address>${item.address}</address>
        <p>${item.description}</p>
        <button>Learn More</button>
      `;

      cardsContainer.appendChild(card);
    });
  } catch (error) {
    console.error("Failed to load discover items:", error);
  }
}

function showVisitMessage() {
  const lastVisit = localStorage.getItem("lastVisit");
  const now = Date.now();

  if (!lastVisit) {
    visitMessage.textContent = "Welcome! Let us know if you have any questions.";
  } else {
    const msInDay = 1000 * 60 * 60 * 24;
    const diff = Math.floor((now - lastVisit) / msInDay);

    if (diff < 1) {
      visitMessage.textContent = "Back so soon! Awesome!";
    } else if (diff === 1) {
      visitMessage.textContent = "You last visited 1 day ago.";
    } else {
      visitMessage.textContent = `You last visited ${diff} days ago.`;
    }
  }

  localStorage.setItem("lastVisit", now);
}

loadDiscoverItems();
showVisitMessage();
