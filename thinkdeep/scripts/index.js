import { customPhilosophers } from '../data/custom-philosophers.js';

const philosopherGrid = document.getElementById('philosopherGrid');
const modal = document.getElementById('philosopherModal');
const closeBtn = document.querySelector('.close-btn');
const searchBar = document.getElementById('searchBar'); 

const proxyUrl = 'https://corsproxy.io/?';
const baseUrl = 'https://philosophersapi.com';

const featuredPhilosophers = [
  "Socrates", "Plato", "Aristotle", "Immanuel Kant",
  "Friedrich Nietzsche", "Lucas C. Roxo", "Simone de Beauvoir", "René Descartes", "Clóvis de Barros Filho", "Leandro Karnal", "Mário Sergio Cortella", "Karl Marx", "Niccolò Machiavelli", "Adam Smith", "John Locke"
];

let allPhilosophersData = []; 

const getPhilosophers = async () => {
  if (!philosopherGrid) return;
  philosopherGrid.innerHTML = '<p>Loading philosophers...</p>';
  const listApiUrl = `${proxyUrl}${baseUrl}/api/philosophers`;

  try {
    const response = await fetch(listApiUrl);
    if (!response.ok) throw new Error(`HTTP error! ${response.status}`);
    
    const apiPhilosophers = await response.json(); 

    allPhilosophersData = [...apiPhilosophers, ...customPhilosophers];
    
    const filteredList = allPhilosophersData.filter(p => featuredPhilosophers.includes(p.name));
    displayPhilosophers(filteredList);

  } catch (error) {
    console.error('Could not load philosophers:', error);
    philosopherGrid.innerHTML = '<p class="error-message">Could not load philosophers.</p>';
  }
};

const displayPhilosophers = (philosophers) => {
  if (!Array.isArray(philosophers)) return;
  philosopherGrid.innerHTML = '';

  if (philosophers.length === 0) {
    philosopherGrid.innerHTML = '<p>No philosophers found matching your search.</p>';
    return;
  }

  philosophers.forEach(p => {
    const card = document.createElement('article');
    card.className = 'philosopher-card';
    card.innerHTML = `
      <h3>${p.name}</h3>
      <p class="muted">${p.life}</p>
      <p class="quote">School: ${p.school || 'N/A'}</p>
      <p><strong>Interests:</strong> ${p.interests.split(',')[0]}</p>
      <button onclick="viewProfile('${p.id}')">View profile</button> 
    `;
    philosopherGrid.appendChild(card);
  });
};

if (searchBar) {
    searchBar.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();

        if (searchTerm === '') {
          const featuredList = allPhilosophersData.filter(p =>
          featuredPhilosophers.includes(p.name)
        );
          displayPhilosophers(featuredList);
          return; 
        } 
        const filteredPhilosophers = allPhilosophersData.filter(p => {
            return p.name.toLowerCase().includes(searchTerm);
        });

        displayPhilosophers(filteredPhilosophers);
    });
}

window.viewProfile = async (id) => {
    if (!id) return;

    if (id.startsWith('CUSTOM-')) {
        const p = customPhilosophers.find(philosopher => philosopher.id === id);
        if (p) {
          if (p.image) {
                modalImage.src = p.image;
                modalImage.alt = `Retrato de ${p.name}`;
                modalImage.style.display = 'block';
            } else {
                modalImage.style.display = 'none';
            }

            const worksList = p.works && p.works.length > 0
                ? `<h4>Major Works</h4>
                   <ul>${p.works.map(w => `<li>${w.title}</li>`).join('')}</ul>`
                : '';
            
            const wikiLink = p.links?.wiki ? `<li><a href="${p.links.wiki}" target="_blank">Wikipedia</a></li>` : '';
            const readMore = wikiLink ? `<h4>Read More</h4><ul>${wikiLink}</ul>` : '';

            document.getElementById('modalName').textContent = p.name;
            document.getElementById('modalYears').textContent = p.life;
            document.getElementById('modalQuote').innerHTML = `
                <p><strong>Born:</strong> ${p.birthLocation || 'Unknown'}</p>
                <p><strong>Interests:</strong> ${p.interests || 'N/A'}</p>
            `;
            document.getElementById('modalBio').innerHTML = `
                ${worksList}
                ${readMore}
            `;
            modal.style.display = 'block';
        }
        return;
    }

    document.getElementById('modalName').textContent = 'Loading details...';
    document.getElementById('modalImage').style.display = 'none';
    document.getElementById('modalYears').textContent = '';
    document.getElementById('modalQuote').textContent = '';
    document.getElementById('modalBio').textContent = '';
    modal.style.display = 'block';
    
    const detailApiUrl = `${proxyUrl}${baseUrl}/api/philosophers/${id}`;
    
    try {
        const response = await fetch(detailApiUrl);
        if (!response.ok) throw new Error(`HTTP error! ${response.status}`);
        const p = await response.json();

        const bioDetails = `
            <p><strong>Born:</strong> ${p.birthLocation?.name || 'Unknown'}</p>
            <p><strong>Interests:</strong> ${p.interests || 'N/A'}</p>
        `;

        const quotesList = p.quotes && p.quotes.length > 0
            ? `<h4>Famous Quotes</h4>
               <ul>${p.quotes.slice(0, 3).map(q => `<li>"${q.quote}"</li>`).join('')}</ul>`
            : '';

        const worksList = p.works && p.works.length > 0
            ? `<h4>Major Works</h4>
               <ul>${p.works.slice(0, 3).map(w => `<li>${w.title}</li>`).join('')}</ul>`
            : '';

        const wikiLink = p.wikiTitle ? `<li><a href="https://en.wikipedia.org/wiki/${p.wikiTitle}" target="_blank">Wikipedia</a></li>` : '';
        const speLink = p.speLink ? `<li><a href="${p.speLink}" target="_blank">Stanford Encyclopedia of Philosophy</a></li>` : '';
        const iepLink = p.iepLink ? `<li><a href="${p.iepLink}" target="_blank">Internet Encyclopedia of Philosophy</a></li>` : '';
        const readMore = wikiLink || speLink || iepLink
            ? `<h4>Read More</h4><ul>${wikiLink}${speLink}${iepLink}</ul>`
            : '';

        const imageUrl = `${baseUrl}${p.images.faceImages.face500x500}`;
        document.getElementById('modalImage').src = imageUrl;
        document.getElementById('modalImage').alt = p.name;
        document.getElementById('modalImage').style.display = 'block';

        document.getElementById('modalName').textContent = p.name;
        document.getElementById('modalYears').textContent = p.life;
        
        document.getElementById('modalQuote').innerHTML = bioDetails;
        
        document.getElementById('modalBio').innerHTML = `
            ${quotesList}
            ${worksList}
            ${readMore}
        `;

    } catch (error) {
        console.error(`Falha ao buscar detalhes do filósofo ${id}:`, error);
        document.getElementById('modalName').textContent = 'Error loading details.';
        document.getElementById('modalBio').textContent = 'Please try again later.';
    }
};

if (modal) {
  closeBtn.onclick = () => modal.style.display = 'none';
  window.onclick = (event) => {
    if (event.target === modal) modal.style.display = 'none';
  };
}

const qotdContainer = document.getElementById('qotd-container');
const pythonAnywhereApiUrl_Ideas = 'https://philosophyapi.pythonanywhere.com/api/ideas/';

const getRandomQuote = async () => {
    if (!qotdContainer) return;

    try {
        const fullUrl = `${proxyUrl}${pythonAnywhereApiUrl_Ideas}`;
        const response = await fetch(fullUrl);
        if (!response.ok) throw new Error(`API error! ${response.status}`);

        const data = await response.json();
        const quotes = data.results;

        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];

        const quoteHtml = `
            <h3>Quote of the Day</h3>
            <p class="quote">"${randomQuote.quote}"</p>
            <p style="text-align: right; font-size: 0.9rem;">— ${randomQuote.author}</p>
        `;

        qotdContainer.innerHTML = quoteHtml;

    } catch (error) {
        console.error("Failed to fetch random quote:", error);
        qotdContainer.innerHTML = `
            <h3>Quote of the Day</h3>
            <p class="muted">Could not load quote.</p>
        `;
    }
};

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

getPhilosophers();
getRandomQuote();