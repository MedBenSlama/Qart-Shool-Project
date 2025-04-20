import * as userService from "../services/userService.js";
import log from "../utils/logger.js";

export const getProfile = async (req, res) => {
  try {
    const user = await userService.getUserProfile(req.userId);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    const updated = await userService.updateAvatar(req.userId, req.file.path);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updated = await userService.updateProfile(req.userId, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const follow = async (req, res) => {
  try {
    const followed = await userService.followUser(req.userId, req.params.id);
    res.json(followed);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const unfollow = async (req, res) => {
  try {
    const unfollowed = await userService.unfollowUser(
      req.userId,
      req.params.id
    );
    res.json(unfollowed);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      log.warn({ userId: req.params.id }, "User not found");
      return res.status(404).json({ message: "User not found" });
    }
    log.info({ userId: user._id }, "User retrieved successfully");
    res.json(user);
  } catch (err) {
    log.error({ err, userId: req.params.id }, "Error fetching user");
    res.status(500).json({ message: "Error fetching user" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    log.info({ userId: user._id }, "User updated successfully");
    res.json(user);
  } catch (err) {
    log.error({ err, userId: req.params.id }, "Error updating user");
    res.status(500).json({ message: "Error updating user" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    log.info({ userId: req.params.id }, "User deleted successfully");
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    log.error({ err, userId: req.params.id }, "Error deleting user");
    res.status(500).json({ message: "Error deleting user" });
  }
};

export const followUser = async (req, res) => {
  try {
    const result = await userService.followUser(req.user._id, req.params.id);
    log.info(
      { followerId: req.user._id, followedId: req.params.id },
      "User followed successfully"
    );
    res.json(result);
  } catch (err) {
    log.error(
      { err, followerId: req.user._id, followedId: req.params.id },
      "Error following user"
    );
    res.status(500).json({ message: "Error following user" });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const result = await userService.unfollowUser(req.user._id, req.params.id);
    log.info(
      { followerId: req.user._id, unfollowedId: req.params.id },
      "User unfollowed successfully"
    );
    res.json(result);
  } catch (err) {
    log.error(
      { err, followerId: req.user._id, unfollowedId: req.params.id },
      "Error unfollowing user"
    );
    res.status(500).json({ message: "Error unfollowing user" });
  }
};
