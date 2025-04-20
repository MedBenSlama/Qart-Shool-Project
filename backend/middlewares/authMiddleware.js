import jwt from "jsonwebtoken";
import log from "../utils/logger.js";

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      log.warn("No token provided");
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    log.info({ userId: decoded.userId }, "User authenticated successfully");
    next();
  } catch (err) {
    log.error({ err }, "Authentication failed");
    res.status(401).json({ message: "Invalid token" });
  }
};

export default authenticate;