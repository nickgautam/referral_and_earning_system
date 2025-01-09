const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const purchase_schema = new mongoose.Schema({
    product_id: { type: ObjectId, ref: "product", default: null }, // we can create the product schema as well and whose _id will be linked with this purchase model
    amount: { type: Number, required: true },
    buyer_id: { type: ObjectId, ref: "user", required: true }
}, { timestamps: true })

module.exports = mongoose.model("purchase", purchase_schema)