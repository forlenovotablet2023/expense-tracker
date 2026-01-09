const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3000;


// middleware
app.use(express.json());
app.use(express.static("public"));

// database
const db = new sqlite3.Database("database.db");

db.run(`
CREATE TABLE IF NOT EXISTS expenses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT,
  category TEXT,
  custom_category TEXT,
  amount REAL
)
`);

// add expense
app.post("/add", (req, res) => {
  const { date, category, customCategory, amount } = req.body;

  db.run(
    "INSERT INTO expenses (date, category, custom_category, amount) VALUES (?, ?, ?, ?)",
    [date, category, customCategory, amount],
    () => res.sendStatus(200)
  );
});

// get all expenses
app.get("/expenses", (req, res) => {
  db.all("SELECT * FROM expenses", [], (err, rows) => {
    res.json(rows);
  });
});
// delete expense by id
app.delete("/delete/:id", (req, res) => {
  const id = req.params.id;

  db.run(
    "DELETE FROM expenses WHERE id = ?",
    [id],
    function (err) {
      if (err) {
        res.status(500).send("Delete failed");
      } else {
        res.sendStatus(200);
      }
    }
  );
});

// start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

