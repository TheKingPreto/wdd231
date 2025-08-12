import { customQuotes } from '../data/custom-quotes.js';

const quotesGrid = document.getElementById('quotes-grid');
const authorFilter = document.getElementById('author-filter');
const toggleBtn = document.getElementById('toggle-favorites-btn');
const searchBar = document.getElementById('quoteSearchBar');

const proxyUrl = 'https://corsproxy.io/?';
const ideasApiUrl = 'https://philosophyapi.pythonanywhere.com/api/ideas/';
let allQuotes = []; 
let favoritesOnly = false; 

const getFavorites = () => {
    const favoritesJSON = localStorage.getItem('favoriteQuotes');
    return favoritesJSON ? JSON.parse(favoritesJSON) : [];
};

const saveFavorites = (favorites) => {
    localStorage.setItem('favoriteQuotes', JSON.stringify(favorites));
};

const getQuotes = async () => {
  if (!quotesGrid) return; 
  quotesGrid.innerHTML = '<p>Loading quotes (this may take a moment)...</p>';
  
  try {
    let allQuotesFromApi = [];
    let currentUrl = ideasApiUrl;

    while (currentUrl) {
        const fullUrl = `${proxyUrl}${currentUrl}`;
        const response = await fetch(fullUrl);
        if (!response.ok) throw new Error(`HTTP error! ${response.status}`);
        const data = await response.json();
        allQuotesFromApi = allQuotesFromApi.concat(data.results);
        currentUrl = data.next; 
    }
    
    allQuotes = [...allQuotesFromApi, ...customQuotes];
    
    populateAuthorFilter(allQuotes); 
    displayQuotes(allQuotes.slice(0, 20)); 

  } catch (error) {
    console.error('Could not load quotes:', error);
    quotesGrid.innerHTML = '<p class="error-message">Could not load quotes.</p>';
  }
};

const displayQuotes = (quotes) => {
  if (!Array.isArray(quotes)) return;
  quotesGrid.innerHTML = '';
  const favorites = getFavorites();

  if (quotes.length === 0) {
    quotesGrid.innerHTML = '<p>No quotes found matching your criteria.</p>';
    return;
  }

  quotes.forEach(q => {
    const quoteCard = document.createElement('article');
    quoteCard.className = 'philosopher-card';
    const isFavorited = favorites.includes(q.id);
    quoteCard.innerHTML = `
      <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" data-id="${q.id}">&#9733;</button>
      <p class="quote" style="font-size: 1.1rem;">"${q.quote}"</p>
      <p style="text-align: right; font-weight: bold;">— ${q.author}</p>
    `;
    quotesGrid.appendChild(quoteCard);
  });

  document.querySelectorAll('.favorite-btn').forEach(btn => {
      btn.addEventListener('click', toggleFavorite);
  });
};

const toggleFavorite = (event) => {
    const quoteId = event.target.dataset.id.includes('-') ? event.target.dataset.id : parseInt(event.target.dataset.id, 10);
    let favorites = getFavorites();

    if (favorites.includes(quoteId)) {
        favorites = favorites.filter(id => id !== quoteId);
        event.target.classList.remove('favorited');
    } else {
        favorites.push(quoteId);
        event.target.classList.add('favorited');
    }
    saveFavorites(favorites);

    if (favoritesOnly) {
        const filteredQuotes = allQuotes.filter(q => favorites.includes(q.id));
        displayQuotes(filteredQuotes);
    }
};

const populateAuthorFilter = (quotes) => {
    const authors = [...new Set(quotes.map(q => q.author))];
    authors.sort();
    authorFilter.innerHTML = '<option value="all">Filter by Author...</option>';
    authors.forEach(author => {
        const option = document.createElement('option');
        option.value = author;
        option.textContent = author;
        authorFilter.appendChild(option);
    });
};

const applyFilters = () => {
    const searchTerm = searchBar.value.toLowerCase();
    const selectedAuthor = authorFilter.value;
    let filteredQuotes = allQuotes;

    if (searchTerm) {
        filteredQuotes = filteredQuotes.filter(q => 
            q.quote.toLowerCase().includes(searchTerm) || 
            q.author.toLowerCase().includes(searchTerm)
        );
    }

    if (selectedAuthor !== 'all') {
        filteredQuotes = filteredQuotes.filter(q => q.author === selectedAuthor);
    }

    if (searchTerm === '' && selectedAuthor === 'all') {
        displayQuotes(allQuotes.slice(0, 20));
    } else {
        displayQuotes(filteredQuotes);
    }
};

if (searchBar) {
    searchBar.addEventListener('input', applyFilters);
}
if (authorFilter) {
    authorFilter.addEventListener('change', applyFilters);
}

if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        favoritesOnly = !favoritesOnly; 
        if (favoritesOnly) {
            const favorites = getFavorites();
            const filteredQuotes = allQuotes.filter(q => favorites.includes(q.id));
            displayQuotes(filteredQuotes);
            toggleBtn.textContent = 'Show All Quotes';
        } else {
            applyFilters();
            toggleBtn.textContent = 'Show Favorites Only';
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname.split("/").pop();
  document.querySelectorAll("nav a").forEach(link => {
    const linkPath = link.getAttribute("href").split("/").pop();
    if (linkPath === currentPath) {
      link.classList.add("active");
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (menuBtn && navMenu) {
    menuBtn.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });
  }
});

getQuotes();