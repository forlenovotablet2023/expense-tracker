const express = require("express");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

// 🔹 Paste your Supabase credentials here
const supabaseUrl = "https://umlbkefxolymxydxmzmy.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtbGJrZWZ4b2x5bXh5ZHhtem15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5OTIwMTQsImV4cCI6MjA4MzU2ODAxNH0.6i-EMkL8Yp2odru6rGu3oqZ_fXeMla3YY2WrkGFjGSA";

const supabase = createClient(supabaseUrl, supabaseKey);

// Add expense
app.post("/add", async (req, res) => {
  const { date, category, customCategory, amount } = req.body;

  const { error } = await supabase.from("expenses").insert([
    {
      date,
      category,
      custom_category: customCategory,
      amount
    }
  ]);

  if (error) return res.status(500).send(error.message);

  res.sendStatus(200);
});

// Get all expenses
app.get("/expenses", async (req, res) => {
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .order("id", { ascending: true });

  if (error) return res.status(500).send(error.message);

  res.json(data);
});

// Delete expense
app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;

  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("id", id);

  if (error) return res.status(500).send(error.message);

  res.sendStatus(200);
});

// Start server
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
