import mongoose, { mongo } from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    lastLoginDate: {
      type: {},
      required: true,
    },
    blocked: {
      type: Boolean,
      required: true,
    }
  },
  {timestamps: true},
)

export default mongoose.model('User', UserSchema);