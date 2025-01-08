const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const user_schema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    parent_id: { type: ObjectId, default: null },
    referral_ids: { type: [ObjectId] , default : []},
    status: { type: Number, default: 1 }, //1-Active user, 2-Inactive user
    // earnings: { type: Number, default: 0 }
}, { timestamps: true })

module.exports = mongoose.model("user", user_schema)

/*
flow
1- parent null referalId = [2,3]
2 - parentId =1 referalId = [4]
3 - parentId =1 
4 - parentId =2
*/