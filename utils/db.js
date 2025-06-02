const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const path = require("path");

// Define the path to your local JSON DB
//const file = path.join(__dirname, "../form_data.json");
//const file = path.join(__dirname, "form_data.json");
const file = path.join(__dirname, "../Routes/form_data.json");

const adapter = new FileSync(file);
const db = low(adapter);

// Initialize default structure (only once)
db.defaults({ graduation: [], compassionate: [], resit: [] }).write();

module.exports = db;
