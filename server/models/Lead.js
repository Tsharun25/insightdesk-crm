import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    score: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },
    source: {
      type: String,
      required: true,
      enum: ["Website", "Referral", "LinkedIn", "Webinar", "Ads"],
    },
    status: {
      type: String,
      required: true,
      enum: ["New", "Hot", "Qualified", "Nurture"],
      default: "New",
    },
  },
  { timestamps: true },
);

export default mongoose.models.Lead || mongoose.model("Lead", leadSchema);
