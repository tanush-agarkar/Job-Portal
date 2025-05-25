import mongoose from "mongoose";

const examLocationSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    studentId: {
      type: String,
      required: true,
      unique: true, // Ensure Student ID is unique
    },
    location: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

export const ExamLocation = mongoose.model("ExamLocation", examLocationSchema);