const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  videoId: {
    type: String,
    required: true,
  },

  note: {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
  },
});

module.exports = mongoose.model("Note", noteSchema);
