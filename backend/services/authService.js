import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import log from "../utils/logger.js";

export const register = async ({ email, password, firstname, lastname }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    log.warn({ email }, "Registration attempt with existing email");
    throw new Error("Email already in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    password: hashedPassword,
    firstname,
    lastname,
  });
  log.info({ userId: user.id }, "New user registered");
  return user;
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    log.warn({ email }, "Login attempt with non-existent email");
    throw new Error("Invalid credentials");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    log.warn({ email }, "Login attempt with incorrect password");
    throw new Error("Invalid credentials");
  }

  
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  log.info({ userId: user.id }, "User logged in successfully");
  return { token, user };
};
