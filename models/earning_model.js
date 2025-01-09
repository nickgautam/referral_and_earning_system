const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const earning_schema = new mongoose.Schema({
    user_id: { type: ObjectId, ref: "user", required: true},
    buyer_id: { type: ObjectId, ref: "user", required: true },
    direct_profit: { type: Number, default: 0 },
    indirect_profit: { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model("earning", earning_schema)