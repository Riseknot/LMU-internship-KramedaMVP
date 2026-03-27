import mongoose from "mongoose";

const HelptaskSchema = new mongoose.Schema({
    taskType: { type: String, required: true },
    
    title: { type: String, required: true },

    description: { type: String, required: true },

    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
            index: "2dsphere", // Geo-Index direkt hier
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },

    address: {
        zipCode: { type: String, index: true }, // Index direkt
        city: String,
        street: String,
    },

    startDate: { type: Date, required: true },
    startTime: { type: String, required: true },

    endDate: { type: Date, required: true },
    endTime: { type: String, required: true },

    status: { type: String, required: true, enum: ["open", "assigned", "completed"], index: true },

    assignedHelper: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true }, // Optional for now

    firstname: { type: String, required: true, index: true },
    surname: { type: String, required: true, index: true },
    email: { type: String, required: true, index: true },

}, { timestamps: true });

export default mongoose.models.Helptask || mongoose.model("Helptask", HelptaskSchema);

