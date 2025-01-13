const express = require("express")
const { body } = require("express-validator")
const { get_my_earning_details, earning_view } = require("../controllers/earning_controller")
const router = express.Router()

router.get("/earning", earning_view)

router.get("/get_my_earning_details", get_my_earning_details)

module.exports = router;