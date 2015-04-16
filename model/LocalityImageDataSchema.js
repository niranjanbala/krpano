var mongoose = require('mongoose'), 
Schema = mongoose.Schema;
var LocalityImageDataSchema = new Schema({
  JS : String, 
  SWF : String, 
  HTML : String, 
  TILES : String, 
  XML: String,
  JPG: String,
  lat: Number,
  lng: Number
});
module.exports = mongoose.model('locality_image_data', LocalityImageDataSchema);