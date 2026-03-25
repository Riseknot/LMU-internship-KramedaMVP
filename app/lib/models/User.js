import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ["helper", "coordinator"] },
  phone: { type: String },
  zipCode: { type: String },
  languages: [{ type: String }],
  bio: { type: String },
  avatarUrl: { type: String },
  skills: [{ type: String }],
  certifications: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true, enum: ["fuehrungszeugnis", "erste-hilfe", "pflegekurs", "other"] },
    uploadedAt: { type: String, required: true },
    verified: { type: Boolean, default: false },
    fileUrl: { type: String },
  }],
  emailVerified: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.User ||
  mongoose.model("User", UserSchema, "users"); // Use existing model if  exists, otherwise create a new one + collection name