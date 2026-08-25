import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
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

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400,
  },
});

export const Message = mongoose.model("Message", messageSchema);