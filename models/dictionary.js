const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Di = new Schema({
  uid: {
    type: String,
  },
  dict: []
  
})
module.exports = mongoose.model("dictionary",Di)
