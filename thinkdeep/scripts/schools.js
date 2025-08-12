const schoolsGrid = document.getElementById('schools-grid');
const proxyUrl = 'https://corsproxy.io/?';

const schoolDescriptions = {
    "kantianism": "A philosophy based on the ethical, epistemological, and metaphysical works of Immanuel Kant.",
    "transcendental idealism": "A doctrine founded by Immanuel Kant, which holds that the mind shapes our experience of reality.",
    "classical liberalism": "A political ideology that values the freedom of individuals — including freedom of religion, speech, press, assembly, and markets.",
    "rationalism": "The view that reason is the chief source and test of knowledge, often contrasted with empiricism.",
    "cartesianism": "The philosophical and scientific system of René Descartes and its subsequent development by other 17th-century thinkers.",
    "mechanism": "The belief that natural wholesale regularities are in fact explicable by mechanical principles.",
    "augustinianism": "The philosophical and theological system of Augustine of Hippo and its subsequent development.",
    "optimism": "In philosophy, the position that this is the best of all possible worlds, often associated with Gottfried Leibniz.",
    "conceptualism": "A theory that explains universality of particulars as conceptualized frameworks situated within the thinking mind.",
    "existentialism": "A form of philosophical inquiry that explores the problem of human existence and centers on the lived experience of the thinking, feeling, acting individual.",
    "phenomenology": "The study of structures of consciousness as experienced from the first-person point of view.",
    "hegelianism": "The philosophy of Georg Wilhelm Friedrich Hegel which can be summed up by the motto 'the rational alone is real'.",
    "foundationalism": "The theory that beliefs are justified based on basic beliefs or foundations that are immune to doubt.",
    "continental philosophy": "A broad term for traditions of 19th and 20th-century philosophy from mainland Europe.",
    "philosophical pessimism": "A philosophical view that regards the world and existence in a fundamentally negative light.",
    "german idealism": "A philosophical movement centered in Germany in the late 18th and early 19th centuries, with key figures like Kant and Hegel.",
    "objective idealism": "An idealistic theory that posits that reality is the expression of a universal mind or spirit, existing independently of individual consciousness."
};

const schoolLinks = {
    "kantianism": "https://en.wikipedia.org/wiki/Kantianism",
    "transcendental idealism": "https://en.wikipedia.org/wiki/Transcendental_idealism",
    "classical liberalism": "https://en.wikipedia.org/wiki/Classical_liberalism",
    "rationalism": "https://en.wikipedia.org/wiki/Rationalism",
    "cartesianism": "https://en.wikipedia.org/wiki/Cartesianism",
    "mechanism": "https://en.wikipedia.org/wiki/Mechanism_(philosophy)",
    "augustinianism": "https://en.wikipedia.org/wiki/Augustinianism",
    "optimism": "https://en.wikipedia.org/wiki/Optimism",
    "conceptualism": "https://en.wikipedia.org/wiki/Conceptualism",
    "existentialism": "https://en.wikipedia.org/wiki/Existentialism",
    "phenomenology": "https://en.wikipedia.org/wiki/Phenomenology_(philosophy)",
    "hegelianism": "https://en.wikipedia.org/wiki/Hegelianism",
    "foundationalism": "https://en.wikipedia.org/wiki/Foundationalism",
    "continental philosophy": "https://en.wikipedia.org/wiki/Continental_philosophy",
    "philosophical pessimism": "https://en.wikipedia.org/wiki/Philosophical_pessimism",
    "german idealism": "https://en.wikipedia.org/wiki/German_idealism",
    "objective idealism": "https://en.wikipedia.org/wiki/Objective_idealism"
};

const getSchools = async () => {
    if (!schoolsGrid) return;
    schoolsGrid.innerHTML = '<p>Loading schools of thought...</p>';
    
    const schoolsApiUrl = 'https://philosophyapi.pythonanywhere.com/api/schools/';
    const fullUrl = `${proxyUrl}${schoolsApiUrl}`;

    try {
        const response = await fetch(fullUrl);
        if (!response.ok) throw new Error(`Schools API error! ${response.status}`);
        const schoolsData = await response.json();
        displaySchools(schoolsData.results);
    } catch (error) {
        console.error('Could not load schools of thought:', error);
        schoolsGrid.innerHTML = '<p class="error-message">Could not load schools of thought.</p>';
    }
};

const displaySchools = (schools) => {
    if (!Array.isArray(schools)) return;
    schoolsGrid.innerHTML = '';

    schools.forEach(s => {
        const schoolCard = document.createElement('article');
        schoolCard.className = 'philosopher-card';

        const descriptionText = schoolDescriptions[s.name.toLowerCase()] || 'No description available.';
        const link = schoolLinks[s.name.toLowerCase()];

        const philosopherList = s.philosophers.length > 0 
            ? s.philosophers.slice(0, 3).join(', ')
            : 'N/A';
        
        schoolCard.innerHTML = `
            <h3>${s.name}</h3>
            <p>${descriptionText}</p>
            <p style="margin-top: 1rem;"><strong>Key Figures:</strong> ${philosopherList}</p>
            ${link ? `<a href="${link}" target="_blank" class="cta-link">Learn more</a>` : ''}
        `;
        schoolsGrid.appendChild(schoolCard);
    });
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

getSchools();