const mysql = require("mysql2");
const express = require("express");
const cors = require("cors");
const path = require("path");


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../FrontEnd")));


const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "Ric@mil12345",
  database: "school_db",
  port: 3360
});

db.connect((err) => {
  if (err) {
    console.error("MySQL connection failed:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

app.get("/students", (req, res) => {
  db.query("SELECT*FROM students where Deleted != 1 ", (err, results) => {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json(results);
    }
  });
});

app.post("/students", (req, res) => {
  const { name, course, year } = req.body;

  db.query(
    "INSERT INTO students (name, course, year) VALUES (?, ?, ?)",
    [name, course, year],
    (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.json({ id: result.insertId });
      }
    }
  );
});

app.put("/students/:id", (req, res) => {
  const { id } = req.params;
  const { name, course, year } = req.body;

  db.query(
    "UPDATE students SET name=?, course=?, year=? WHERE id=?",
    [name, course, year, id],
    (Err) => {
      if (Err) {
        res.status(500).json(Err);
      } else {
        res.json({
          id,
          name,
          course,
          year
        });
      }
    }
  );
});

app.delete("/students/:id", (req, res) => {
  const { id } = req.params;

     db.query(
    "UPDATE students SET Deleted = 1 WHERE id = ?", // column names must match
    [id],
    (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.json({ deleted: true });
      }
    }
  );
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  const query = "SELECT * FROM users WHERE username=? AND password=?";
  db.query(query, [username, password], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length > 0) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});