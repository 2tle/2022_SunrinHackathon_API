const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Profile = new Schema({
  uid: {
	  type: String,
  },
  img: {
	  type: Buffer,
  }
})
module.exports = mongoose.model("profile",Profile)