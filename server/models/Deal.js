import mongoose from "mongoose";

const dealSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: String,
      required: true,
      trim: true,
    },
    stage: {
      type: String,
      required: true,
      enum: ["New", "Discovery", "Proposal", "Negotiation", "Won"],
      default: "New",
    },
  },
  { timestamps: true },
);

export default mongoose.models.Deal || mongoose.model("Deal", dealSchema);
