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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: null,
  },
});

urlSchema.index({ shortCode: 1 }, { unique: true });
urlSchema.index({ customBackHalf: 1 }, { unique: true, sparse: true });

export default mongoose.models.Url || mongoose.model("Url", urlSchema);
