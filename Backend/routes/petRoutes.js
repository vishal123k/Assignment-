const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");

const {
  createPet,
  getPets,
  updatePet,
  deletePet
} = require("../controllers/petController");

router.post("/pet", auth, upload.single("image"), createPet);

router.get("/pet", auth, getPets);

router.put("/pet/:id", auth, upload.single("image"), updatePet);

router.delete("/pet/:id", auth, deletePet);

module.exports = router;
