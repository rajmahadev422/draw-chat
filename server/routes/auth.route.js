import { Router } from "express";
import User from "../models/User.model.js";
import { generateToken, protect } from "../utils/connect.js";

const authRouter = Router();

authRouter.get("/", (req, res) => {
  res.send("Login route");
});

authRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username }).select("+password");
    if (!user) {
      return res
        .status(400)
        .json({ ok: false, msg: "Invalid username or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ ok: false, msg: "Invalid username or password" });
    }
    const token = generateToken(user);

    return res
      .cookie("refreshtoken", token, {
        httpOnly: true,
        secure: false, // Keep false for localhost HTTP
        sameSite: "lax", // Use 'lax' for same-domain/localhost ports
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .json({
        ok: true,
        msg: "Login successful",
        data: { username: user.username, _id: user._id, name: user.name },
      });
  } catch (err) {
    console.error("Login error:", err);
    return res
      .status(500)
      .json({ ok: false, msg: "Server error during login" });
  }
});

authRouter.post("/register", async (req, res, next) => {
  const { username, password, name } = req.body;

  if (!name || !username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already taken" });
    }
    const user = await User.create({
      name,
      username,
      password,
    });

    const token = generateToken(user);
    
    res
      .cookie("refreshToken", token, {
        httpOnly: true,
        secure: false, // Keep false for localhost HTTP
        sameSite: "lax", // Use 'lax' for same-domain/localhost ports
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(201)
      .json({
        message: "User created successfully",
        data: {
          id: user._id,
          name: user.name,
          username: user.username,
        },
      });
  } catch (err) {
    console.error("Registration error:", err.message);
    return res
      .status(500)
      .json({ ok: false, msg: "Server error during registration" });
  }
});

authRouter.get("/get-user", protect, async (req, res) => {
  const userId = req.userId.id;

  const user = await User.findById(userId).select("-password");
  return res
    .status(200)
    .json({ ok: true, msg: "User authenticated", data: user });
});

authRouter.post("/logout", (req, res) => {
  res.clearCookie("refreshtoken").json({ ok: true, message: "Logged out" });
});
export default authRouter;
