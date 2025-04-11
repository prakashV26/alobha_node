const mongoose = require("mongoose");

const TaskManagementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", 
      required: true
    },
    title: {
      type: String,
      required: true
    },
    desc: {
      type: String
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    dueDate: {
      type: String,
      enum:['today', 'this_week', 'overdue'] 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("TaskManagement", TaskManagementSchema);
