import mongoose from "mongoose";

const CommunityPostSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Creator's user ID
  username: { type: String, required: true }, // Creator's name
  caption: { type: String, required: true }, // Post text content
  imageUrl: { type: String, required: false }, // Optional image URL
  boosts: { type: Number, default: 0 }, // Total number of boosts
  createdAt: { type: Date, default: Date.now }, // Timestamp of post creation
});

export default mongoose.models.CommunityPost ||
  mongoose.model("CommunityPost", CommunityPostSchema);
