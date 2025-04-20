"use client"

import { useState } from "react"
import { useQartStore } from "../../store/qartStore"

const CreateQart = ({ onClose }) => {
  const { createQart, isLoading } = useQartStore()
  const [content, setContent] = useState("")
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [error, setError] = useState("")

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!content.trim()) {
      setError("Content is required")
      return
    }

    try {
      const formData = new FormData()
      formData.append("content", content)
      if (image) {
        formData.append("image", image)
      }

      await createQart(formData)
      onClose()
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create qart. Please try again.")
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create Qart</h2>
          <button onClick={onClose} className="text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
            ></textarea>
          </div>

          {imagePreview && (
            <div className="mb-4 relative">
              <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="rounded-lg max-h-60 w-auto" />
              <button
                type="button"
                onClick={() => {
                  setImage(null)
                  setImagePreview(null)
                }}
                className="absolute top-2 right-2 bg-white rounded-full p-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <label className="cursor-pointer text-purple-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>

            <button type="submit" disabled={isLoading} className="btn btn-primary">
              {isLoading ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateQart
