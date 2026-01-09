const express = require("express");
const Database = require("better-sqlite3");

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(express.static("public"));

// database (better-sqlite3)
const db = new Database("database.db");

// create table
db.prepare(`
  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    category TEXT,
    custom_category TEXT,
    amount REAL
  )
`).run();

// add expense
app.post("/add", (req, res) => {
  const { date, category, customCategory, amount } = req.body;

  db.prepare(
    "INSERT INTO expenses (date, category, custom_category, amount) VALUES (?, ?, ?, ?)"
  ).run(date, category, customCategory, amount);

  res.sendStatus(200);
});

// get all expenses
app.get("/expenses", (req, res) => {
  const rows = db.prepare("SELECT * FROM expenses").all();
  res.json(rows);
});

// delete expense by id
app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;

  db.prepare("DELETE FROM expenses WHERE id = ?").run(id);
  res.sendStatus(200);
});

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
