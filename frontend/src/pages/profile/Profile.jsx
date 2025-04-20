import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUserStore } from "../../store/userStore";
import { useQartStore } from "../../store/qartStore";
import { useAuthStore } from "../../store/authStore";
import QartList from "../../components/posts/QartList";
import CreateQart from "../../components/posts/CreateQart";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getImageUrl = (path) => {
  if (!path) return "/placeholder.svg";
  if (path.startsWith("http")) return path;
  return `${API_URL}/${path}`;
};

const Profile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuthStore();
  const { fetchUserProfile, followUser, unfollowUser, profileUser, isLoading } =
    useUserStore();
  const {
    fetchUserQarts,
    fetchLikedQarts,
    userQarts,
    likedQarts,
    isLoading: isQartsLoading,
  } = useQartStore();
  const [activeTab, setActiveTab] = useState("posts");
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchUserProfile(userId);
  }, [fetchUserProfile, userId]);

  useEffect(() => {
    if (activeTab === "posts") {
      fetchUserQarts(userId);
    } else if (activeTab === "liked") {
      fetchLikedQarts();
    }
  }, [fetchUserQarts, fetchLikedQarts, userId, activeTab]);

  const isCurrentUser = currentUser?._id === userId;
  const isFollowing = profileUser?.followers?.includes(currentUser?._id);

  const handleFollowToggle = () => {
    if (isFollowing) {
      unfollowUser(userId);
    } else {
      followUser(userId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
            {profileUser.avatar ? (
              <img
                src={getImageUrl(profileUser.avatar)}
                alt={profileUser.firstname}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-medium">
                {profileUser.firstname?.charAt(0)}
                {profileUser.lastname?.charAt(0)}
              </span>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900">
              {profileUser.firstname} {profileUser.lastname}
            </h1>
            <p className="text-gray-500">{profileUser.email}</p>

            <div className="flex justify-center sm:justify-start space-x-4 mt-2">
              <div>
                <span className="font-bold">
                  {profileUser.following?.length || 0}
                </span>{" "}
                <span className="text-gray-500">Following</span>
              </div>
              <div>
                <span className="font-bold">
                  {profileUser.followers?.length || 0}
                </span>{" "}
                <span className="text-gray-500">Followers</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            {isCurrentUser ? (
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary"
              >
                Create Post
              </button>
            ) : (
              <button
                onClick={handleFollowToggle}
                className={`px-4 py-2 rounded-md font-medium ${
                  isFollowing
                    ? "bg-gray-200 text-gray-800"
                    : "bg-purple-600 text-white"
                }`}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("posts")}
            className={`flex-1 py-3 font-medium ${
              activeTab === "posts"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500"
            }`}
          >
            Posts
          </button>
          {isCurrentUser && (
            <button
              onClick={() => setActiveTab("liked")}
              className={`flex-1 py-3 font-medium ${
                activeTab === "liked"
                  ? "text-purple-600 border-b-2 border-purple-600"
                  : "text-gray-500"
              }`}
            >
              Liked
            </button>
          )}
        </div>

        <div className="p-4">
          {isQartsLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <QartList qarts={activeTab === "posts" ? userQarts : likedQarts} />
          )}
        </div>
      </div>

      {showCreateModal && (
        <CreateQart
          onClose={() => {
            setShowCreateModal(false);
            // Refresh posts after creating a new one
            if (activeTab === "posts") {
              fetchUserQarts(userId);
            }
          }}
        />
      )}
    </div>
  );
};

export default Profile;
