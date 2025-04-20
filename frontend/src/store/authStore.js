import { create } from "zustand"
import api from "../services/api"

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  register: async (userData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.post("/auth/register", userData)
      const { token, user } = await api
        .post("/auth/login", {
          email: userData.email,
          password: userData.password,
        })
        .then((res) => res.data)

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))

      set({ user, isAuthenticated: true, isLoading: false })
    } catch (error) {
      set({ error: error.response?.data?.error || "Registration failed", isLoading: false })
      throw error
    }
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.post("/auth/login", credentials)
      const { token, user } = response.data

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))

      set({ user, isAuthenticated: true, isLoading: false })
    } catch (error) {
      set({ error: error.response?.data?.error || "Login failed", isLoading: false })
      throw error
    }
  },

  logout: () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    set({ user: null, isAuthenticated: false })
  },

  checkAuth: () => {
    set({ isLoading: true })
    const token = localStorage.getItem("token")
    const user = JSON.parse(localStorage.getItem("user") || "null")

    if (token && user) {
      set({ user, isAuthenticated: true, isLoading: false })
    } else {
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },

  updateUser: (userData) => {
    const updatedUser = { ...get().user, ...userData }
    localStorage.setItem("user", JSON.stringify(updatedUser))
    set({ user: updatedUser })
  },
}))
