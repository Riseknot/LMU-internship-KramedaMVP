// import express from "express";
// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";
// import cors from "cors";
// import dotenv from "dotenv";

// dotenv.config();
// const app = express();

// app.use(cors());
// app.use(express.json());

// // --- MongoDB Connection ---
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => {
//     console.error(err);
//     process.exit(1);
//   });


// const User = mongoose.model("User", userSchema);

// // --- Registration Route ---
// app.post("/register", async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     // Prüfen, ob User existiert
//     const existing = await User.findOne({ email });
//     if (existing) return res.status(400).json({ msg: "User already exists" });

//     // Passwort hashen
//     const hashed = await bcrypt.hash(password, 10);

//     // User speichern
//     const user = new User({
//       name,
//       email,
//       password: hashed,
//       role,
//     });

//     await user.save();
//     res.json({ msg: "Registered successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// // --- Start Server ---
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));