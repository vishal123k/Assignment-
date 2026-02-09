const Pet = require("../models/Pet");
const cloudinary = require("../config/cloudinary");

const extractPublicId = (url)=>{
  if(!url) return null;

  return url
    .split("/")
    .slice(-2)
    .join("/")
    .split(".")[0];
};



// CREATE
const createPet = async (req,res)=>{
  try{

    const pet = await Pet.create({
      ...req.body,
      image:req.file?.path || "",
      userId:req.user.id
    });

    res.status(201).json(pet);

  }catch(err){
    res.status(500).json({
      message:"Creation failed"
    });
  }
};



// GET
const getPets = async (req,res)=>{
  const pets = await Pet.find({
    userId:req.user.id
  });

  res.json(pets);
};



// UPDATE
const updatePet = async (req,res)=>{
  try{

    const pet = await Pet.findOne({
      _id:req.params.id,
      userId:req.user.id
    });

    if(!pet)
      return res.status(404).json({
        message:"Pet not found"
      });

    // delete old
    if(req.file && pet.image){

      const publicId =
        extractPublicId(pet.image);

      await cloudinary
        .uploader
        .destroy(publicId);
    }

    const updates = {
      ...req.body
    };

    if(req.file){
      updates.image = req.file.path;
    }

    const updatedPet =
      await Pet.findByIdAndUpdate(
        pet._id,
        updates,
        {new:true}
      );

    res.json(updatedPet);

  }catch{
    res.status(500).json({
      message:"Update failed"
    });
  }
};



// DELETE
const deletePet = async (req,res)=>{
  try{

    const pet = await Pet.findOne({
      _id:req.params.id,
      userId:req.user.id
    });

    if(pet?.image){

      const publicId =
        extractPublicId(pet.image);

      await cloudinary
        .uploader
        .destroy(publicId);
    }

    await Pet.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message:"Deleted"
    });

  }catch{
    res.status(500).json({
      message:"Delete failed"
    });
  }
};

module.exports = {
  createPet,
  getPets,
  updatePet,
  deletePet
};
