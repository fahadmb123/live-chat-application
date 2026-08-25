import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  userId: string;
  username: string;
  message: string;
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    userId: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Message =
  mongoose.models.Message ||
  mongoose.model<IMessage>("Message", messageSchema);