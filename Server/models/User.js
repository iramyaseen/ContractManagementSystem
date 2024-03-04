import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
  avatar: { type: String, default: "uploads/user_profile.png" },
  otpCode: { type: Number },
  otpExpire: { type: Date },
  role: {type: String, enum: ['user', 'admin'], trim: true, default: 'user' },
  status: { type: String, enum: ['active', 'blocked'], default: 'active' }
});

const userModal = mongoose.model("user", userSchema);

export default userModal;
