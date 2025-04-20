import { create } from "zustand";
import api from "../services/api";

export const useCommentStore = create((set, get) => ({
  comments: [],
  isLoading: false,
  error: null,

  fetchCommentsByQart: async (qartId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/comments/qart/${qartId}`);
      set({ comments: response.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to fetch comments",
        isLoading: false,
      });
    }
  },

  addComment: async (commentData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/comments", commentData);
      set({
        comments: [...get().comments, response.data],
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to add comment",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteComment: async (commentId) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/comments/${commentId}`);
      set({
        comments: get().comments.filter((comment) => comment._id !== commentId),
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.error || "Failed to delete comment",
        isLoading: false,
      });
    }
  },
}));
