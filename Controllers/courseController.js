const CourseModel = require("../Model/courseModel");

// ✅ Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await CourseModel.getAllCourses();
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get a course by ID
exports.getCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await CourseModel.getCourseById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Create a new course
exports.createCourse = async (req, res) => {
  const { course_code, course_name, credits, prerequisite } = req.body;
  
  if (!course_code || !course_name || !credits) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const courseId = await CourseModel.createCourse(course_code, course_name, credits, prerequisite);
    res.status(201).json({ message: "Course created successfully", courseId });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Failed to create course" });
  }
};

// ✅ Update a course
exports.updateCourse = async (req, res) => {
  const { id } = req.params;
  const { course_code, course_name, credits, prerequisite } = req.body;

  if (!course_code || !course_name || !credits) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const updated = await CourseModel.updateCourse(id, course_code, course_name, credits, prerequisite);
    if (!updated) return res.status(404).json({ message: "Course not found or not updated" });

    res.json({ message: "Course updated successfully" });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: "Failed to update course" });
  }
};

// ✅ Delete a course
exports.deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await CourseModel.deleteCourse(id);
    if (!deleted) return res.status(404).json({ message: "Course not found or not deleted" });

    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "Failed to delete course" });
  }
};
