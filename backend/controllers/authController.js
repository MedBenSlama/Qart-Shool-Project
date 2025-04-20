import * as authService from "../services/authService.js";
import log from "../utils/logger.js";

export const register = async (req, res) => {
  try {
    const { email, password, firstname, lastname } = req.body;

    if (!email || !password || !firstname || !lastname) {
      return res.status(400).json({
        error: "Email, password, firstname and lastname are required",
      });
    }

    const user = await authService.register({
      email,
      password,
      firstname,
      lastname,
    });
    log.info({ userId: user.id }, "User registered successfully");
    res.status(201).json(user);
  } catch (err) {
    log.error({ err, email: req.body.email }, "Registration failed");
    if (err.message === "Email already in use") {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Error during registration" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const { token, user } = await authService.login({ email, password });
    log.info({ userId: user.id }, "User logged in successfully");
    res.json({ token, user: user });
  } catch (err) {
    log.error({ err, email: req.body.email }, "Login failed");
    if (err.message === "Invalid credentials") {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    res.status(500).json({ error: "Error during login" });
  }
};
