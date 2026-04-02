const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
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
  username: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true, 
  },
}, { timestamps: true });

const Expense = mongoose.model("Expense", expenseSchema);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  passwordHash: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);

app.post("/auth/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const normalizedUsername = username.trim().toLowerCase();
    const existingUser = await User.findOne({ username: normalizedUsername });

    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username: normalizedUsername, passwordHash });

    return res.status(201).json({ message: "User created", user: { id: user._id, username: user.username } });
  } catch (error) {
    return res.status(500).json({ message: "Error creating user", error: error.message });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const normalizedUsername = username.trim().toLowerCase();
    const user = await User.findOne({ username: normalizedUsername });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    return res.status(200).json({ message: "Login successful", user: { id: user._id, username: user.username } });
  } catch (error) {
    return res.status(500).json({ message: "Error during login", error: error.message });
  }
});

app.post("/add-expense", async (req, res) => {
  try {
    const { username, title, amount } = req.body;

    if (!username || !title || amount === undefined) {
      return res.status(400).json({ message: "Username, title and amount are required" });
    }

    const newExpense = new Expense({
      username: username.trim().toLowerCase(),
      title,
      amount,
    });

    await newExpense.save();
    res.json({ message: "Expense added successfully", expense: newExpense });
  } catch (error) {
    res.status(500).json({ message: "Error creating expense", error: error.message });
  }
});

app.get("/expenses", async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const normalizedUsername = username.trim().toLowerCase();
    const expenses = await Expense.find({ username: normalizedUsername }).sort({ createdAt: -1 });
    res.json({ message: "Expenses fetched successfully", expenses });
  } catch (error) {
    res.status(500).json({ message: "Error fetching expenses", error: error.message });
  }
});

app.delete("/delete-expense/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const normalizedUsername = username.trim().toLowerCase();
    const deletedExpense = await Expense.findOneAndDelete({ _id: id, username: normalizedUsername });

    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found for this user" });
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting expense", error: error.message });
  }
});

startServer();
