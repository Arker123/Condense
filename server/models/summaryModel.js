const mongoose = require('mongoose');

const summarySchema = new mongoose.Schema(
    {
      videoId: {
        type: String,
        required: true,
      },

      summary: {
        body: {
          type: String,
          required: true,
        },
      },
    },
    {timestamps: true},
);

module.exports = mongoose.model('Summary', summarySchema);
