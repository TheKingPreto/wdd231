const apiKey = "0156d2f7bc6c625a4dd1ab0fd2a45aee";
const city = "Gravataí,BR"; 
const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    const current = data.list[0];
    document.getElementById("current-temp").textContent = `${current.main.temp.toFixed(1)} °C`;
    document.getElementById("weather-desc").textContent = current.weather[0].description;

    const forecast = document.getElementById("forecast");
    forecast.innerHTML = "";

    for (let i = 8; i <= 24; i += 8) {
      const item = data.list[i];
      const div = document.createElement("div");
      const date = new Date(item.dt_txt).toLocaleDateString("en-US", { weekday: 'short' });
      div.textContent = `${date}: ${item.main.temp.toFixed(1)} °C`;
      forecast.appendChild(div);
    }
  })
  .catch(err => console.error("Error fetching climate data:", err));
