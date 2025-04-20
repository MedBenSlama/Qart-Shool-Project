
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../../store/authStore"
import { useUserStore } from "../../store/userStore"

const ProfileSettings = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { updateProfile, updateAvatar, isLoading } = useUserStore()
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
  })
  const [avatar, setAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (user) {
      setFormData({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
      })
      setAvatarPreview(user.avatar || null)
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatar(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      await updateProfile(formData)

      if (avatar) {
        const formData = new FormData()
        formData.append("avatar", avatar)
        await updateAvatar(formData)
      }

      setSuccess("Profile updated successfully")
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile. Please try again.")
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {success && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden mb-4">
              {avatarPreview ? (
                <img src={avatarPreview || "/placeholder.svg"} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-medium">
                  {user?.firstname?.charAt(0)}
                  {user?.lastname?.charAt(0)}
                </span>
              )}
            </div>

            <label className="cursor-pointer btn btn-secondary">
              Change Avatar
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label htmlFor="firstname" className="form-label">
                First Name
              </label>
              <input
                id="firstname"
                name="firstname"
                type="text"
                value={formData.firstname}
                onChange={handleChange}
                className="input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastname" className="form-label">
                Last Name
              </label>
              <input
                id="lastname"
                name="lastname"
                type="text"
                value={formData.lastname}
                onChange={handleChange}
                className="input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button type="button" onClick={() => navigate(`/profile/${user?._id}`)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="btn btn-primary">
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProfileSettings
