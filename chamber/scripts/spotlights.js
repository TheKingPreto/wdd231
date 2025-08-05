const spotlightContainer = document.querySelector(".spotlight-container");

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

    const membershipLevel = member.membership === 3 ? "Gold" : "Silver";

    const membershipLevels = ["Basic", "Silver", "Gold"];

    card.innerHTML = `
      <img src="images/${member.image}" alt="Logo of ${member.name}">
      <h3>${member.name}</h3>
      <p>${member.info}</p>
      <p><strong>Endereço:</strong> ${member.address}</p>
      <p><strong>Associação:</strong> ${membershipLevels[member.membership - 1]}</p>
      <p><a href="${member.website}" target="_blank">Visitar site</a></p>
    `;

    spotlightContainer.appendChild(card);
  });
}

getMembers();
