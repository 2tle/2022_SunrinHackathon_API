const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Image = new Schema({
	uid: {
		type: String
	},
	imgType: {
		type: String
	},
	timestamp: {
		type: String
	},
	image: {
		type: Buffer,
	},
})

module.exports = mongoose.model("Image",Image)