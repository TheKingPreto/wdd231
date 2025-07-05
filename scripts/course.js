const courses = [
  { code: "WDD 130", name: "Web Fundamentals", credits: 1, category: "WDD", completed: true },
  { code: "WDD 131", name: "Dynamic Web", credits: 2, category: "WDD", completed: true },
  { code: "WDD 231", name: "Front-end Frameworks", credits: 3, category: "WDD", completed: false },
];

function displayCourses(filter = "All") {
  const container = document.getElementById("courses");
  container.innerHTML = "";
  const filtered = courses.filter(course => filter === "All" || course.category === filter);
  let total = 0;

  filtered.forEach(course => {
    const card = document.createElement("div");
    card.className = `course ${course.completed ? "completed" : ""}`;
    card.innerHTML = `<h3>${course.code}</h3><p>${course.name}</p><p>${course.credits} credits</p>`;
    container.appendChild(card);
    total += course.credits;
  });

  document.getElementById("totalCredits").textContent = `The total credits for course listed above is ${total}`;
}

document.getElementById("all").addEventListener("click", () => displayCourses("All"));
document.getElementById("cse").addEventListener("click", () => displayCourses("CSE"));
document.getElementById("wdd").addEventListener("click", () => displayCourses("WDD"));

window.addEventListener("DOMContentLoaded", () => displayCourses());
