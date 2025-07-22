const courses = [
  { code: "WDD 130", name: "Web Fundamentals", credits: 2, category: "WDD", completed: true },
  { code: "WDD 131", name: "Dynamic Web Fundamentals", credits: 2, category: "WDD", completed: true },
  { code: "WDD 231", name: "Web Front-end Development 1", credits: 2, category: "WDD", completed: false },
  { code: "WDD 330", name: "Web Front-end Development 2", credits: 2, category: "WDD", completed: false },
  { code: "CSE 111", name: "Programming with Functions Current Retake", credits: 2, category: "CSE", completed: true },
  { code: "CSE 210", name: "Programming with Classes", credits: 2, category: "CSE", completed: true },
  { code: "CSEPC 110", name: "Introduction to Programming", credits: 2, category: "CSE", completed: true }
];

function displayCourseDetails(course) {
  const modal = document.getElementById("course-details");

  modal.innerHTML = `
    <button id="closeModal" title="Close Modal">❌</button>
    <h2>${course.code}</h2>
    <h3>${course.name}</h3>
    <p><strong>Credits:</strong> ${course.credits}</p>
    <p><strong>Category:</strong> ${course.category}</p>
    <p><strong>Status:</strong> ${course.completed ? "✅ Completed" : "❌ Incomplete"}</p>
  `;

  modal.showModal();

  document.getElementById("closeModal").addEventListener("click", () => {
    modal.close();
  });

  modal.addEventListener("click", (event) => {
    const rect = modal.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    ) {
      modal.close();
    }
  }, { once: true });
}

function displayCourses(filter = "All") {
  const container = document.getElementById("courses");
  container.innerHTML = "";

  const filtered = courses.filter(course => filter === "All" || course.category === filter);

  let totalCompletedCredits = 0;
  let completedCount = 0;
  let incompleteCount = 0;

  filtered.forEach(course => {
    const card = document.createElement("div");
    card.className = `course ${course.completed ? "completed" : ""}`;
    card.innerHTML = `<h3>${course.code}</h3> <p>${course.name}</p> <p>${course.credits} credits</p>`;
    card.addEventListener("click", () => {
      displayCourseDetails(course);
    });

    container.appendChild(card);

    if (course.completed) {
      totalCompletedCredits += course.credits;
      completedCount++;
    } else {
      incompleteCount++;
    }
  });

  const totalCreditsEl = document.getElementById("totalCredits");
  totalCreditsEl.innerHTML = `
    You have <strong>${totalCompletedCredits}</strong> earned credits from the courses listed above.<br>
    🟢 <strong>${completedCount}</strong> course(s) completed | 🔴 <strong>${incompleteCount}</strong> course(s) incomplete
  `;
  totalCreditsEl.style.textAlign = "center";
  totalCreditsEl.style.fontWeight = "bold";
}




document.getElementById("all").addEventListener("click", () => displayCourses("All"));
document.getElementById("cse").addEventListener("click", () => displayCourses("CSE"));
document.getElementById("wdd").addEventListener("click", () => displayCourses("WDD"));

window.addEventListener("DOMContentLoaded", () => displayCourses());
