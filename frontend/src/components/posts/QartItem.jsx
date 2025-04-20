"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useQartStore } from "../../store/qartStore";
import { useAuthStore } from "../../store/authStore";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const QartItem = ({ qart }) => {
  const { user } = useAuthStore();
  const { likeQart, unlikeQart, deleteQart } = useQartStore();
  const [showComments, setShowComments] = useState(false);

  if (!qart || !qart.user) {
    return null;
  }

  const isLiked = qart.likes?.includes(user?._id) || false;
  const isOwner = qart.user._id === user?._id;

  const getImageUrl = (path) => {
    if (!path) return "/placeholder.svg";
    if (path.startsWith("http")) return path;
    return `${API_URL}/${path}`;
  };

  const handleLikeToggle = () => {
    if (isLiked) {
      unlikeQart(qart._id);
    } else {
      likeQart(qart._id);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this qart?")) {
      deleteQart(qart._id);
    }
  };

  return (
    <div className="card">
      <div className="flex items-start space-x-3">
        <Link to={`/profile/${qart.user._id}`}>
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
            {qart.user.avatar ? (
              <img
                src={getImageUrl(qart.user.avatar)}
                alt={qart.user.firstname}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium">
                {qart.user.firstname?.charAt(0)}
                {qart.user.lastname?.charAt(0)}
              </span>
            )}
          </div>
        </Link>

        <div className="flex-1">
          <div className="flex justify-between">
            <Link
              to={`/profile/${qart.user._id}`}
              className="font-medium text-gray-900"
            >
              {qart.user.firstname} {qart.user.lastname}
            </Link>
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(qart.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>

          <p className="mt-1 text-gray-800">{qart.content}</p>

          {qart.image && (
            <div className="mt-3">
              <img
                src={getImageUrl(qart.image)}
                alt="Qart"
                className="rounded-lg max-h-96 w-auto"
              />
            </div>
          )}

          <div className="mt-4 flex items-center space-x-4">
            <button
              onClick={handleLikeToggle}
              className={`flex items-center space-x-1 ${
                isLiked ? "text-purple-600" : "text-gray-500"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill={isLiked ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>{qart.likes.length}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center space-x-1 text-gray-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>{qart.comments.length}</span>
            </button>

            {isOwner && (
              <button onClick={handleDelete} className="text-red-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
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

          {showComments && (
            <div className="mt-4 space-y-4">
              <CommentList qartId={qart._id} />
              <CommentForm qartId={qart._id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QartItem;
