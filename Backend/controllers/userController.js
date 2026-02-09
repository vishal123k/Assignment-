  const User = require("../models/User");
  const cloudinary = require("../config/cloudinary");

  const extractPublicId = (url)=>{
    if(!url) return null;

    return url
      .split("/")
      .slice(-2)
      .join("/")
      .split(".")[0]; 
  };



  const updateUser = async (req,res)=>{
  try{

    const user = await User.findById(req.user.id);

    if(!user){
      return res.status(404).json({
        message:"User not found"
      });
    }


    if(req.file && user.profileImage){

      const publicId =
        extractPublicId(user.profileImage);

      await cloudinary.uploader.destroy(publicId);
    }


    if(req.body.interests){
      try{
        req.body.interests =
          JSON.parse(req.body.interests);
      }catch{
        req.body.interests = [];
      }
    }


    const updates = {
      ...req.body
    };


    if(req.file){
      updates.profileImage = req.file.path;
    }


    const updatedUser =
      await User.findByIdAndUpdate(
        req.user.id,
        updates,
        {
          new:true,
          runValidators:true
        }
      ).select("-password");


    res.json(updatedUser);

  }catch(err){
    console.log(err);
    res.status(500).json({
      message:"Update failed"
    });
  }
};



  const getUser = async (req,res)=>{
    try{

      const user = await User
        .findById(req.user.id)
        .select("-password");

      res.json(user);

    }catch{
      res.status(500).json({
        message:"Fetch failed"
      });
    }
  };

  module.exports = {
    updateUser,
    getUser
  };
