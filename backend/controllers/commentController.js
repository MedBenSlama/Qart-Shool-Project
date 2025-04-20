import * as commentService from "../services/commentService.js";
import log from "../utils/logger.js";

export const createComment = async (req, res) => {
  try {
    if (!req.body.text || !req.body.qartId) {
      return res.status(400).json({ error: "Text and qartId are required" });
    }
    const comment = await commentService.createComment({
      content: req.body.text,
      qartId: req.body.qartId,
      userId: req.userId,
    });
    res.status(201).json(comment);
  } catch (err) {
    log.error({ err, qartId: req.body.qartId }, "Error creating comment");
    res.status(500).json({ error: "Error creating comment" });
  }
};

export const getByQart = async (req, res) => {
  try {
    const comments = await commentService.getCommentsByQart(req.params.qartId);
    res.json(comments);
  } catch (err) {
    log.error({ err, qartId: req.params.qartId }, "Error fetching comments");
    res.status(400).json({ error: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    await commentService.deleteComment(req.params.id, req.userId);
    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    log.error({ err, commentId: req.params.id }, "Error deleting comment");
    if (err.message === "Comment not found") {
      return res.status(404).json({ error: "Comment not found" });
    }
    if (err.message === "Not authorized") {
      return res
        .status(401)
        .json({ error: "Not authorized to delete this comment" });
    }
    res.status(500).json({ error: "Error deleting comment" });
  }
};
