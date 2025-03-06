import mongoose from "mongoose";

const CaptionSchema = new mongoose.Schema({
    userId: { type: String, required: true },  // Store user ID to link captions to users
    prompt: { type: String },
    image: { type: String },  // Store image URL (if needed)
    captions: [{ type: String }], // Array of generated captions
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Caption || mongoose.model("Caption", CaptionSchema);
