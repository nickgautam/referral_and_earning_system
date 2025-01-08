const express = require("express")
const { body } = require("express-validator")
const { create_user, get_users_for_referral } = require("../controllers/user_controller")
const router = express.Router()


router.post("/create_user",
body("name").trim().notEmpty().withMessage("name is required")
.bail().not().isInt().withMessage('Invalid name'),
body("email").trim().notEmpty().withMessage("email is required")
.bail().isEmail().withMessage('Invalid email'),
body("password").trim().notEmpty().withMessage("password is required")
.bail().isLength({min:6}).withMessage('password must be of min 6 character or digit'),
create_user)

router.get("/get_users_for_referral", get_users_for_referral)


module.exports = router;