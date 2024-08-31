import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
  },
  customBackHalf: {
    type: String,
    unique: true,
    sparse: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  userId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: null,
  },
  clickData: [
    {
      timestamp: Date,
      ipAddress: String,
      userAgent: String,
    },
  ],
});

export default mongoose.models.Url || mongoose.model("Url", urlSchema);
