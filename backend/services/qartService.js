import Qart from "../models/Qart.js";
import log from "../utils/logger.js";

export const createQart = async ({ userId, content, image }) => {
  try {
    const qart = await Qart.create({ content, image, user: userId });
    log.info({ qart }, "Qart created successfully");
    return qart;
  } catch (error) {
    log.error({ error }, "Error creating qart");
    throw error;
  }
};

export const getAllQarts = async () => {
  try {
    const qarts = await Qart.find()
      .populate("user", "firstname lastname avatar")
      .populate({
        path: "comments",
        populate: { path: "user", select: "firstname lastname avatar" },
      })
      .sort({ createdAt: -1 });
    log.info({ qarts }, "Retrieved qarts successfully");
    return qarts;
  } catch (error) {
    log.error({ error }, "Error fetching qarts");
    throw error;
  }
};

export const deleteQart = async (id, userId) => {
  try {
    const qart = await Qart.findById(id);
    if (!qart) throw new Error("Qart not found");
    if (qart.user.toString() !== userId) throw new Error("Not authorized");
    await qart.deleteOne({ _id: id });
    log.info({ qart }, "Qart deleted successfully");
  } catch (error) {
    log.error({ error }, "Error deleting qart");
    throw error;
  }
};

export const getQartById = async (id) => {
  try {
    const qart = await Qart.findById(id)
      .populate("user", "firstname lastname avatar")
      .populate({
        path: "comments",
        populate: { path: "user", select: "firstname lastname avatar" },
      });
    log.info({ qart }, "Retrieved qart successfully");
    return qart;
  } catch (error) {
    log.error({ error }, "Error fetching qart");
    throw error;
  }
};

export const getQartByUserId = async (userId) => {
  try {
    const qarts = await Qart.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("user", "firstname lastname email avatar")
      .populate({
        path: "comments",
        populate: { path: "user", select: "firstname lastname avatar" },
      })
      .exec();
    log.info({ qarts }, "Retrieved qarts successfully");
    return qarts;
  } catch (error) {
    log.error({ error }, "Error fetching qarts");
    throw error;
  }
};

export const likeQart = async (qartId, userId) => {
  try {
    const qart = await Qart.findById(qartId);
    if (!qart) throw new Error("Qart not found");

    if (!qart.likes.includes(userId)) {
      qart.likes.push(userId);
      await qart.save();
    }
    log.info({ qart }, "Qart liked successfully");
    return qart;
  } catch (error) {
    log.error({ error }, "Error liking qart");
    throw error;
  }
};

export const unlikeQart = async (qartId, userId) => {
  try {
    const qart = await Qart.findById(qartId);
    if (!qart) throw new Error("Qart not found");

    qart.likes = qart.likes.filter((id) => id.toString() !== userId);
    await qart.save();
    log.info({ qart }, "Qart unliked successfully");
    return qart;
  } catch (error) {
    log.error({ error }, "Error unliking qart");
    throw error;
  }
};

export const getLikedQarts = async (userId) => {
  try {
    const likedQarts = await Qart.find({ likes: userId })
      .sort({ createdAt: -1 })
      .populate("user", "firstname lastname avatar")
      .populate({
        path: "comments",
        populate: { path: "user", select: "firstname lastname avatar" },
      });
    log.info({ likedQarts }, "Retrieved liked qarts successfully");
    return likedQarts;
  } catch (error) {
    log.error({ error }, "Error fetching liked qarts");
    throw error;
  }
};
