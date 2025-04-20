import User from "../models/User.js";

export const getUserProfile = async (id) => {
  return await User.findById(id).select("-password");
};

export const updateAvatar = async (id, filePath) => {
  return await User.findByIdAndUpdate(
    id,
    { avatar: filePath },
    { new: true }
  ).select("-password");
};

export const updateProfile = async (id, updates) => {
  const allowedFields = ["firstname", "lastname", "email"];
  const filteredUpdates = {};

  for (let key of allowedFields) {
    if (updates[key] !== undefined) {
      filteredUpdates[key] = updates[key];
    }
  }

  return await User.findByIdAndUpdate(id, filteredUpdates, {
    new: true,
  }).select("-password");
};

export const followUser = async (userId, targetId) => {
  if (userId === targetId) throw new Error("Cannot follow yourself");

  const user = await User.findById(userId);
  const target = await User.findById(targetId);

  if (!target || !user) throw new Error("User not found");

  if (!user.following.includes(targetId)) {
    user.following.push(targetId);
    await user.save();
  }

  if (!target.followers.includes(userId)) {
    target.followers.push(userId);
    await target.save();
  }

  return target;
};

export const unfollowUser = async (userId, targetId) => {
  const user = await User.findById(userId);
  const target = await User.findById(targetId);

  if (!target || !user) throw new Error("User not found");

  user.following = user.following.filter((id) => id.toString() !== targetId);
  target.followers = target.followers.filter((id) => id.toString() !== userId);

  await user.save();
  await target.save();

  return target;
};
