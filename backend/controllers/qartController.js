import * as qartService from "../services/qartService.js";
import log from "../utils/logger.js";

export const create = async (req, res) => {
  try {
    const qart = await qartService.createQart({
      userId: req.userId,
      content: req.body.content,
      image: req.file?.path,
    });
    res.status(201).json(qart);
  } catch (err) {
    log.error({ err }, "Error creating qart");
    res.status(500).json({ message: "Error creating qart" });
  }
};

export const getAll = async (req, res) => {
  try {
    const qarts = await qartService.getAllQarts();
    log.info({ count: qarts.length }, "Retrieved all qarts");
    res.json(qarts);
  } catch (err) {
    log.error({ err }, "Error fetching qarts");
    res.status(500).json({ message: "Error fetching qarts" });
  }
};

export const getById = async (req, res) => {
  try {
    const qart = await qartService.getQartById(req.params.id);
    if (!qart) {
      log.warn({ qartId: req.params.id }, "Qart not found");
      return res.status(404).json({ message: "Qart not found" });
    }
    log.info({ qartId: req.params.id }, "Retrieved qart by id");
    res.json(qart);
  } catch (err) {
    log.error({ err, qartId: req.params.id }, "Error fetching qart");
    res.status(500).json({ message: "Error fetching qart" });
  }
};

export const deleteQart = async (req, res) => {
  try {
    await qartService.deleteQart(req.params.id, req.userId);
    log.info({ qartId: req.params.id }, "Qart deleted successfully");
    res.status(200).json({ message: "Qart deleted successfully" });
  } catch (err) {
    log.error({ err, qartId: req.params.id }, "Error deleting qart");
    res.status(500).json({ message: "Error deleting qart" });
  }
};

export const getByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const qarts = await qartService.getQartByUserId(userId);

    if (!qarts || qarts.length === 0) {
      return res.status(404).json({ message: "No qarts found for this user" });
    }

    log.info(
      { userId: req.params.userId, count: qarts.length },
      "Retrieved user qarts"
    );
    res.json(qarts);
  } catch (err) {
    log.error({ err, userId: req.params.userId }, "Error fetching user qarts");
    res.status(500).json({ message: "Error fetching qarts" });
  }
};

export const likeQart = async (req, res) => {
  try {
    const qart = await qartService.likeQart(req.params.id, req.userId);
    log.info(
      { qartId: req.params.id, userId: req.userId },
      "Qart liked successfully"
    );
    res.json(qart);
  } catch (err) {
    log.error({ err, qartId: req.params.id }, "Error liking qart");
    res.status(500).json({ message: "Error liking qart" });
  }
};

export const unlikeQart = async (req, res) => {
  try {
    const qart = await qartService.unlikeQart(req.params.id, req.userId);
    log.info(
      { qartId: req.params.id, userId: req.userId },
      "Qart unliked successfully"
    );
    res.json(qart);
  } catch (err) {
    log.error({ err, qartId: req.params.id }, "Error unliking qart");
    res.status(500).json({ message: "Error unliking qart" });
  }
};

export const getLikedQarts = async (req, res) => {
  try {
    const qarts = await qartService.getLikedQarts(req.userId);
    if (!qarts || qarts.length === 0) {
      return res.status(404).json({ message: "No liked qarts found" });
    }
    log.info(
      { userId: req.userId, count: qarts.length },
      "Retrieved liked qarts"
    );
    res.json(qarts);
  } catch (err) {
    log.error({ err, userId: req.userId }, "Error fetching liked qarts");
    res.status(500).json({ message: "Error fetching liked qarts" });
  }
};
