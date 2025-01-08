const express = require("express")
const { body } = require("express-validator")
const { create_purchase } = require("../controllers/purchase_controller")
const router = express.Router()


router.post("/create_purchase",
body("amount").trim().notEmpty().withMessage("amount is required")
    .bail().isFloat().withMessage('Invalid amount'),
body("buyer_id").trim().notEmpty().withMessage("buyer id is required")
    .bail().isMongoId().withMessage('Invalid buyer id'),
create_purchase)



module.exports = router;