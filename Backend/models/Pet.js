const mongoose = require("mongoose");

const petSchema = new mongoose.Schema({

  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  petName:String,
  breed:String,
  gender:String,
  age:Number,
  weight:Number,
  vaccinated:Boolean,

  image:{
    type:String,
    default:""
  }

},{timestamps:true});

module.exports = mongoose.model("Pet", petSchema);
