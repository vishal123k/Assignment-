const User = require("../models/User");
const cloudinary = require("../config/cloudinary");

//Extract cloudinary public id safely
const extractPublicId = (url) => {
  if (!url) return null;

  const parts = url.split("/");
  const file = parts[parts.length - 1];
  const folder = parts[parts.length - 2];

  return `${folder}/${file.split(".")[0]}`;
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    //Safely delete image
    if (req.file && user.profileImage) {
      try {
        const publicId = extractPublicId(user.profileImage);

        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (err) {
        console.log("Cloudinary delete error:", err);
      }
    }

    let interests = [];
    if (req.body.interests) {
      try {
        interests = JSON.parse(req.body.interests);
      } catch {
        interests = [];
      }
    }

    // only allowed fields
    const updates = {
      name: req.body.name,
      bio: req.body.bio,
      contactInfo: req.body.contactInfo,
      interests,
    };

    //If new image uploaded
    if (req.file) {
      updates.profileImage = req.file.path;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    return res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    if (!res.headersSent) {
      return res.status(500).json({
        message: err.message || "Update failed",
      });
    }
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    return res.json(user);
  } catch (err) {
    console.log("GET ERROR", err);

    return res.status(500).json({
      message: err.message || "Fetch failed",
    });
  }
};

module.exports = {
  updateUser,
  getUser,
};
