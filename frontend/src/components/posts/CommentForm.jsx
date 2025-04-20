"use client"

import { useState } from "react"
import { useCommentStore } from "../../store/commentStore"

const CommentForm = ({ qartId }) => {
  const { addComment, isLoading } = useCommentStore()
  const [text, setText] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!text.trim()) return

    try {
      await addComment({ text, qartId })
      setText("")
    } catch (err) {
      console.error("Failed to add comment:", err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <div className="flex space-x-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
        />
        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className="px-3 py-2 bg-purple-600 text-white rounded-md text-sm disabled:opacity-50"
        >
          {isLoading ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  )
}

export default CommentForm
