const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3333;
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
  })
);

app.use(express.json());
app.get("/", (req, res) => {
  res.json({ message: "Expense Tracker API is running" });
});

async function startServer() {
  const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/expensetracker";

  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}


const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true, 
  }
});

const Expense = mongoose.model("Expense", expenseSchema);

app.post("/add-expense", async (req, res) => {
  try {
    const { title, amount } = req.body;
    const newExpense = new Expense({ title, amount });
    await newExpense.save();
    res.json({ message: "Expense added successfully", expense: newExpense });
  } catch (error) {
    res.send({ message: "Error creating expense", error: error.message });
  }
});

app.get("/expenses", async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json({ message: "Expenses fetched successfully", expenses });
  } catch (error) {
    res.json({ message: "Error fetching expenses", error: error.message });
  }
});

app.delete("/delete-expense/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Expense.findByIdAndDelete(id);
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.json({ message: "Error deleting expense", error: error.message });
  }
});

startServer();
