const byuiCourse = {
  code: "CSE121b",
  name: "JavaScript Language",
  sections: [
    { sectionNum: 1, roomNum: "STC 353", enrolled: 26, days: "TTh", instructor: "Bro. Jackson" },
    { sectionNum: 2, roomNum: "STC 347", enrolled: 25, days: "TTh", instructor: "Sis. Smith" },
  ],
  changeEnrollment(sectionNum, add = true) {
    const section = this.sections.find(sec => sec.sectionNum == sectionNum);
    if (section) {
      add ? section.enrolled++ : section.enrolled--;
    }
  }
};

export default byuiCourse;
