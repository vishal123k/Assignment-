const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  email:{
    type:String,
    required:true,
    unique:true
  },

  password:{
    type:String,
    required:true
  },

  isVerified:{
    type:Boolean,
    default:false
  },

  emailOTP:String,
  otpExpires:Date,

  name:String,
  bio:String,
  interests:[String],
  contactInfo:String,

  profileImage:{
    type:String,
    default:""
  }

},{timestamps:true});

module.exports = mongoose.model("User", userSchema);
