import { create } from "zustand"
import api from "../services/api"
import { useAuthStore } from "./authStore"

export const useQartStore = create((set, get) => ({
  qarts: [],
  userQarts: [],
  likedQarts: [],
  isLoading: false,
  error: null,

  fetchQarts: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.get("/qarts")
      set({ qarts: response.data, isLoading: false })
    } catch (error) {
      set({ error: error.response?.data?.error || "Failed to fetch qarts", isLoading: false })
    }
  },

  fetchUserQarts: async (userId) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.get(`/qarts/user/${userId}`)
      set({ userQarts: response.data, isLoading: false })
    } catch (error) {
      set({ error: error.response?.data?.error || "Failed to fetch user qarts", isLoading: false })
    }
  },

  fetchLikedQarts: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.get("/qarts/liked")
      set({ likedQarts: response.data, isLoading: false })
    } catch (error) {
      set({ error: error.response?.data?.error || "Failed to fetch liked qarts", isLoading: false })
    }
  },

  createQart: async (formData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.post("/qarts", formData)
      set({
        qarts: [response.data, ...get().qarts],
        isLoading: false,
      })
      return response.data
    } catch (error) {
      set({ error: error.response?.data?.error || "Failed to create qart", isLoading: false })
      throw error
    }
  },

  deleteQart: async (qartId) => {
    set({ isLoading: true, error: null })
    try {
      await api.delete(`/qarts/${qartId}`)
      set({
        qarts: get().qarts.filter((qart) => qart._id !== qartId),
        userQarts: get().userQarts.filter((qart) => qart._id !== qartId),
        isLoading: false,
      })
    } catch (error) {
      set({ error: error.response?.data?.error || "Failed to delete qart", isLoading: false })
    }
  },

  likeQart: async (qartId) => {
    try {
      const response = await api.post(`/qarts/${qartId}/like`)
      const updatedQart = response.data

      // Update qarts list
      set({
        qarts: get().qarts.map((qart) => (qart._id === qartId ? updatedQart : qart)),
        userQarts: get().userQarts.map((qart) => (qart._id === qartId ? updatedQart : qart)),
      })

      // Add current user to likes
      const currentUser = useAuthStore.getState().user
      if (currentUser && !updatedQart.likes.includes(currentUser._id)) {
        updatedQart.likes.push(currentUser._id)
      }

      return updatedQart
    } catch (error) {
      console.error("Failed to like qart:", error)
    }
  },

  unlikeQart: async (qartId) => {
    try {
      const response = await api.post(`/qarts/${qartId}/unlike`)
      const updatedQart = response.data

      // Update qarts list
      set({
        qarts: get().qarts.map((qart) => (qart._id === qartId ? updatedQart : qart)),
        userQarts: get().userQarts.map((qart) => (qart._id === qartId ? updatedQart : qart)),
        likedQarts: get().likedQarts.filter((qart) => qart._id !== qartId),
      })

      // Remove current user from likes
      const currentUser = useAuthStore.getState().user
      if (currentUser) {
        updatedQart.likes = updatedQart.likes.filter((id) => id !== currentUser._id)
      }

      return updatedQart
    } catch (error) {
      console.error("Failed to unlike qart:", error)
    }
  },
}))
