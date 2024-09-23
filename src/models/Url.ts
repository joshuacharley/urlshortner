import mongoose, { Schema, Document } from 'mongoose'

export interface IUrl extends Document {
  originalUrl: string;
  shortId: string;
  clicks: number;
  createdAt: Date;
  expiresAt?: Date;
  password?: string;
}

const urlSchema = new Schema<IUrl>({
  originalUrl: { type: String, required: true },
  shortId: { type: String, required: true, unique: true, index: true },
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  password: { type: String },
})

// Add a pre-save hook to ensure shortId is never null
urlSchema.pre('save', function(next) {
  if (!this.shortId) {
    next(new Error('shortId cannot be null'));
  } else {
    next();
  }
});

export const Url = mongoose.models.Url || mongoose.model<IUrl>('Url', urlSchema)