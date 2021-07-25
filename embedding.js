const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String,
});

const Author = mongoose.model("Author", authorSchema);

const Course = mongoose.model(
  "Course",
  new mongoose.Schema({
    name: String,
    authors: [authorSchema],
  })
);

async function createCourse(name, authors) {
  const course = new Course({
    name,
    authors,
  });

  const result = await course.save();
  console.log(result);
}

async function listCourses() {
  const courses = await Course.find();
  console.log(courses);
}

async function updateAuthor(courseID) {
  const course = await Course.findById(courseID);
  course.author.name = "Usman Afzal";
  course.save();
}

async function addAuthor(courseID, author) {
  const course = await Course.findById(courseID);
  course.authors.push(author);
  course.save();
}

async function removeAuthor(courseID, authorID) {
  const course = await Course.findById(courseID);
  const author = course.authors.id(authorID);
  author.remove();
  course.save();
}

// createCourse("Node Course", [
//   new Author({ name: "Mosh" }),
//   new Author({ name: "Usman" }),
// ]);
// updateAuthor("60fd7db54206de2f9c32eab4");
removeAuthor("60fd8f96bdfbce32a0b6e502", "60fd95d0e079983128c63b3e");
