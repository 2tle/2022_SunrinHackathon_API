const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Barcode = new Schema({
	uid: {
		type: String,
	},
	name: {
		type: String,
	},
	barcode: {
		type: String,
	},
	price: {
		type: Number,
	},
	photo: {
		type: String
	},
})

module.exports = mongoose.model("barcode",Barcode)