import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const protect = (req, res, next) => {
  const token = req.cookies.refreshtoken;

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

import cron from "node-cron";
import Room from "../models/Room.model.js";

cron.schedule("* * * * *", async () => {
  const twentyMinAgo = new Date(Date.now() - 20 * 60 * 1000);

  await Room.updateMany(
    {
      status: "open",
      createdAt: { $lte: twentyMinAgo },
    },
    {
      $set: { status: "closed" },
    }
  );

  console.log("Expired rooms closed");
});