const router = require("express").Router();
const {
  signUp,
  verifyEmail,
  signIn
} = require("../controllers/authController");

router.post("/auth/sign-up",signUp);
router.post("/auth/verify-email",verifyEmail);
router.post("/auth/sign-in",signIn);

module.exports = router;
