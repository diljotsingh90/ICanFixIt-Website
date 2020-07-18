const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const meassageSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  issueId: {
    type: Schema.Types.ObjectId,
    ref: "Issue",
    required: true,
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  /*  resetToken: String,
  resetTokenExpiration: Date, */
});

module.exports = mongoose.model("Message", meassageSchema);
