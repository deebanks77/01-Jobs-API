const mongoose = require("mongoose");
const { Schema } = mongoose;

const JobsSchema = new Schema(
  {
    company: {
      type: String,
      required: [true, "please provide a valid email"],
      minlength: 3,
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, "please provide a valid position"],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["pending", "interview", "declined"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "please provide a valid id"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", JobsSchema);
