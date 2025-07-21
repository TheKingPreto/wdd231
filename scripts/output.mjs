export function setTitle(course) {
  const titleElement = document.querySelector("#courseName");
  titleElement.textContent = `${course.code}: ${course.name}`;
}

export function renderSections(sections) {
  const html = sections.map(
    section => `
      <li>
        Section ${section.sectionNum} | Room: ${section.roomNum} | 
        Enrolled: ${section.enrolled} | Days: ${section.days} | 
        Instructor: ${section.instructor}
      </li>`
  ).join("");

  document.querySelector("#sections").innerHTML = html;
}
