import { create } from "zustand"
import api from "../services/api"
import { useAuthStore } from "./authStore"

export const useUserStore = create((set, get) => ({
  profileUser: null,
  isLoading: false,
  error: null,

  fetchUserProfile: async (userId) => {
    set({ isLoading: true, error: null })
    try {
      // If it's the current user, get from /users/me
      if (userId === useAuthStore.getState().user?._id) {
        const response = await api.get("/users/me")
        set({ profileUser: response.data, isLoading: false })
      } else {
        // For other users, we'd need an endpoint to get user by ID
        // This is not in the API docs, so we'll simulate it
        const allQarts = await api.get("/qarts")
        const userQart = allQarts.data.find((qart) => qart.user._id === userId)
        if (userQart) {
          set({ profileUser: userQart.user, isLoading: false })
        } else {
          set({ profileUser: null, isLoading: false, error: "User not found" })
        }
      }
    } catch (error) {
      set({ error: error.response?.data?.error || "Failed to fetch user profile", isLoading: false })
    }
  },

  updateProfile: async (userData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.put("/users/me", userData)
      set({ profileUser: response.data, isLoading: false })

      // Update the user in auth store
      useAuthStore.getState().updateUser(response.data)

      return response.data
    } catch (error) {
      set({ error: error.response?.data?.error || "Failed to update profile", isLoading: false })
      throw error
    }
  },

  updateAvatar: async (formData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.put("/users/me/avatar", formData)
      set({ profileUser: response.data, isLoading: false })

      // Update the user in auth store
      useAuthStore.getState().updateUser(response.data)

      return response.data
    } catch (error) {
      set({ error: error.response?.data?.error || "Failed to update avatar", isLoading: false })
      throw error
    }
  },

  followUser: async (userId) => {
    try {
      const response = await api.post(`/users/${userId}/follow`)
      set({ profileUser: response.data })
      return response.data
    } catch (error) {
      console.error("Failed to follow user:", error)
    }
  },

  unfollowUser: async (userId) => {
    try {
      const response = await api.post(`/users/${userId}/unfollow`)
      set({ profileUser: response.data })
      return response.data
    } catch (error) {
      console.error("Failed to unfollow user:", error)
    }
  },
}))
