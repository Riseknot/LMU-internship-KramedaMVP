import mongoose from "mongoose";

const HelptaskSchema = new mongoose.Schema({
    taskType: { type: String, required: true },
    
    title: { type: String, required: true },

    description: { type: String, required: true },

    public_loc: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        }
    },

    address: {
        zipCode: { type: String, index: true }, // Index direkt
        city: String,
        street: String,
        streetNumber: String,
    },

    start: { type: Date, required: true },
    end: { type: Date, required: true },

    status: { type: String, required: true, enum: ["open", "assigned", "completed"], index: true },

    assignedHelper: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true }, // Optional for now

    firstname: { type: String, required: true, index: true },
    surname: { type: String, required: true, index: true },
    email: { type: String, required: true, index: true },

}, { timestamps: true });

// Public area used for privacy-safe map display.
HelptaskSchema.index({ public_loc: '2dsphere' });

// In Next.js dev/hot-reload, reusing mongoose.models.Helptask can keep an old
// schema shape alive. Recreate the model so schema changes (e.g. start/end)
// take effect immediately.
if (mongoose.models.Helptask) {
    mongoose.deleteModel('Helptask');
}

export default mongoose.model("Helptask", HelptaskSchema);

