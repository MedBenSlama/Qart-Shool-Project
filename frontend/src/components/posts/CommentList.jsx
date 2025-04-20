"use client";

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useCommentStore } from "../../store/commentStore";
import { useAuthStore } from "../../store/authStore";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getImageUrl = (path) => {
  if (!path) return "/placeholder.svg";
  if (path.startsWith("http")) return path;
  return `${API_URL}/${path}`;
};

const CommentList = ({ qartId }) => {
  const { fetchCommentsByQart, comments, deleteComment, isLoading } =
    useCommentStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchCommentsByQart(qartId);
  }, [fetchCommentsByQart, qartId]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-2">
        <p className="text-gray-500 text-sm">No comments yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment._id} className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-start space-x-2">
            <Link to={`/profile/${comment.user._id}`}>
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                {comment.user.avatar ? (
                  <img
                    src={getImageUrl(comment.user.avatar)}
                    alt={comment.user.firstname}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-medium">
                    {comment.user.firstname?.charAt(0)}
                    {comment.user.lastname?.charAt(0)}
                  </span>
                )}
              </div>
            </Link>

            <div className="flex-1">
              <div className="flex justify-between">
                <Link
                  to={`/profile/${comment.user._id}`}
                  className="font-medium text-gray-900 text-sm"
                >
                  {comment.user.firstname} {comment.user.lastname}
                </Link>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>

              <p className="text-gray-800 text-sm mt-1">{comment.text}</p>
            </div>

            {comment.user._id === user?._id && (
              <button
                onClick={() => deleteComment(comment._id)}
                className="text-red-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
