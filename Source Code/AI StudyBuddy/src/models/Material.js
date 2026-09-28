const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    originalText: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    summary: {
      type: String,
    },
    flashcards: {
      type: String,
    },
    quiz: {
      type: String,
    },
    studyPlan: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Material', materialSchema);