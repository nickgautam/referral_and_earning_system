const express = require("express")
const { body } = require("express-validator")
const { register_view, create_user, get_users_for_referral, login_view, user_login } = require("../controllers/user_controller")
const router = express.Router()


router.get('/register', register_view);
router.get('/login', login_view);

router.post("/create_user",
body("name").trim().notEmpty().withMessage("name is required")
.bail().not().isInt().withMessage('Invalid name'),
body("email").trim().notEmpty().withMessage("email is required")
.bail().isEmail().withMessage('Invalid email'),
body("password").trim().notEmpty().withMessage("password is required")
.bail().isLength({min:6}).withMessage('password must be of min 6 character or digit'),
create_user)

router.post("/user_login",
body("email").trim().notEmpty().withMessage("email is required")
.bail().isEmail().withMessage('Invalid email'),
body("password").trim().notEmpty().withMessage("password is required"),
user_login)

router.get("/get_users_for_referral", get_users_for_referral) // this api functionality has been shift inside register api


module.exports = router;