const purchase = require("../models/purchase_model")
const user = require("../models/user_model")
const earning = require("../models/earning_model")


exports.create_purchase = async (req, res) => {
    try {
        // error handling by express-validator
        let error_exist = throw_error(req)
        if (error_exist) return res.status(400).send(error_exist)

        let { amount, buyer_id } = req.body

        if (+amount < 1000) return res.status(400).send({ status: 400, message: 'Purchase amount must be more than 1000rs' })

        let check_user_exist = await user.findOne({_id: buyer_id, status:1})

        if (!check_user_exist) return res.status(400).send({ status: 400, message: 'Buyer does not exist to purchase the product' }) // additional validation to handle edge case

        let direct_profit = +amount * 0.05
        let indirect_profit = +amount * 0.01

        if (check_user_exist.parent_id && +amount > 1000) {

            let check_parent_user = await user.findOne({ _id: check_user_exist.parent_id, status: 1 }) // here parent user exist and active condition is checking
            
            if (check_parent_user) {

                await earning.create({ user_id: check_user_exist.parent_id, buyer_id: buyer_id, direct_profit: direct_profit }) //here direct earning is being created

                let parents_parent_user = await user.findOne({ referral_ids: { $in: [check_parent_user._id] }, status: 1 }) // here parent's parent user existance is being checked

                if (parents_parent_user) {
                    await earning.create({ user_id: parents_parent_user._id, buyer_id: buyer_id, indirect_profit: indirect_profit }) // here indirect profit is being created
                }
            }
        }
        await purchase.create(req.body) // here purchase is being created.

        return res.status(200).send({status: 200, message:'Purchased successfully'})
    } catch (err) {
        return res.status(500).send({ status: 500, message: "Internal Server Error", error: err.message })
    }
}