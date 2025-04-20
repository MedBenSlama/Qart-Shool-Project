import Comment from "../models/Comment.js";
import Qart from "../models/Qart.js";
import log from "../utils/logger.js";

export const createComment = async ({ content, userId, qartId }) => {
  const comment = await Comment.create({
    text: content,
    user: userId,
    qart: qartId,
  });
  await Qart.findByIdAndUpdate(qartId, { $push: { comments: comment._id } });
  log.info({ commentId: comment._id, qartId }, "Comment created successfully");
  return comment.populate("user", "firstname lastname avatar");
};

export const getCommentsByQart = async (qartId) => {
  const comments = await Comment.find({ qart: qartId })
    .populate("user", "firstname lastname avatar")
    .sort({ createdAt: -1 });
  log.info(
    { qartId, count: comments.length },
    "Retrieved comments successfully"
  );
  return comments;
};

export const deleteComment = async (commentId, userId) => {
  const comment = await Comment.findById(commentId);
  if (!comment) {
    log.warn({ commentId }, "Comment not found");
    throw new Error("Comment not found");
  }
  if (comment.user.toString() !== userId) {
    log.warn({ commentId, userId }, "User not authorized to delete comment");
    throw new Error("Not authorized");
  }

  await Qart.findByIdAndUpdate(comment.qart, {
    $pull: { comments: comment._id },
  });
  await comment.deleteOne();
  log.info({ commentId }, "Comment deleted successfully");
};
