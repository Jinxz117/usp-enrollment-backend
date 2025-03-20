const db = require("./db");

const CourseModel = {
  // ✅ Get all courses
  getAllCourses: async () => {
    try {
      const [rows] = await db.execute("SELECT * FROM courses");
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // ✅ Get a course by ID
  getCourseById: async (id) => {
    try {
      const [rows] = await db.execute("SELECT * FROM courses WHERE id = ?", [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      throw error;
    }
  },

  // ✅ Create a new course
  createCourse: async (course_code, course_name, credits, prerequisite) => {
    try {
      const [result] = await db.execute(
        "INSERT INTO courses (course_code, course_name, credits, prerequisite) VALUES (?, ?, ?, ?)",
        [course_code, course_name, credits, prerequisite]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },

  // ✅ Update a course
  updateCourse: async (id, course_code, course_name, credits, prerequisite) => {
    try {
      const [result] = await db.execute(
        "UPDATE courses SET course_code = ?, course_name = ?, credits = ?, prerequisite = ? WHERE id = ?",
        [course_code, course_name, credits, prerequisite, id]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  },

  // ✅ Delete a course
  deleteCourse: async (id) => {
    try {
      const [result] = await db.execute("DELETE FROM courses WHERE id = ?", [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = CourseModel;
