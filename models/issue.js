const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const issueSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  hostId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  latestActivity: {
    type: Date,
  },
  /*  resetToken: String,
  resetTokenExpiration: Date, */
});

module.exports = mongoose.model("Issue", issueSchema);
