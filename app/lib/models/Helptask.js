import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    taskType: { type: String, required: true },
    description: { type: String, required: true },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: { type: String, required: true, enum: ["open", "assigned", "completed"] },
    assignedHelper: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

export default mongoose.models.Helptask ||
  mongoose.model("Helptask", HelptaskSchema, "helptasks"); // Use existing model if exists, otherwise create a new one + collection name