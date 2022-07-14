const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Comment = new Schema({
  uid: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
})
module.exports = mongoose.model("comment",Comment)
