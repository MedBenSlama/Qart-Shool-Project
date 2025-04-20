import mongoose from "mongoose";

const qartSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    image: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("Qart", qartSchema);
