const spotlightContainer = document.querySelector("#spotlights");

async function getMembers() {
  const response = await fetch("data/members.json");
  const data = await response.json();
  displaySpotlights(data);
}

function displaySpotlights(members) {
  const filtered = members.filter(member =>
    member.membership === 2 || member.membership === 3
  );

  const shuffled = filtered.sort(() => 0.5 - Math.random());

  const selected = shuffled.slice(0, 3);

  selected.forEach(member => {
    const card = document.createElement("section");
    card.classList.add("spotlight-card");

    card.innerHTML = `
      <img src="images/${member.image}" alt="Logo of ${member.name}">
      <h3>${member.name}</h3>
      <p>${member.info}</p>
      <p><a href="${member.website}" target="_blank">Visitar site</a></p>
    `;

    spotlightContainer.appendChild(card);
  });
}

getMembers();
