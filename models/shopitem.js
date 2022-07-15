const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TwoShopItem = new Schema({
	category1: {
		type: String
	},
	price1: {
		type: Number
	},
	name1: {
		type: String
	},
	photo1: { //더미데이터 삽입시 url 형식으로 리턴!
		type: String
	},
	description1: {
		type: String
	},

	category2: {
		type: String
	},
	price2: {
		type: Number
	},
	name2: {
		type: String
	},
	photo2: { //더미데이터 삽입시 url 형식으로 리턴!
		type: String
	},
	description2: {
		type: String
	}
})

module.exports = mongoose.model("shopitem",TwoShopItem)