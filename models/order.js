var mongoose = require("mongoose");



// SCHEMA SETUP
var orderSchema = new mongoose.Schema({
   cus_name: String,
   cus_address: String,
   cus_pincode: String,
   cus_phone : String ,
   cus_product : String,
   cus_product_name:String
});

var Order = mongoose.model("Order", orderSchema);

module.exports =(Order)