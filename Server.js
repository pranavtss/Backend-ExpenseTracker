const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = 3333;
app.use(cors());

app.use(express.json());
mongoose
  .connect("mongodb+srv://pranavsubburaj_db_user:tsspranav002@cluster0.eykrkom.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log(error);
  });


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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
