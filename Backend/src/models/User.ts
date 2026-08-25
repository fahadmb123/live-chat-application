import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
}

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const User =
  mongoose.models.User ||
  mongoose.model<IUser>("User", userSchema);