const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");

const {
  updateUser,
  getUser
} = require("../controllers/userController");

router.get("/user", auth, getUser);

router.put(
  "/user",
  auth,
  upload.single("profileImage"),
  updateUser
);

module.exports = router;
