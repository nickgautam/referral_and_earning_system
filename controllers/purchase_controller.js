const purchase = require("../models/purchase_model")
const user = require("../models/user_model")
const earning = require("../models/earning_model")
const jwt = require("jsonwebtoken")

exports.create_purchase = async (req, res) => {
    try {
        // error handling by express-validator
        let error_exist = throw_error(req)
        if (error_exist) return res.status(400).send(error_exist)

        let { amount, buyer_id } = req.body

        if (+amount < 1000) return res.status(400).send({ status: 400, message: 'Purchase amount must be more than 1000rs' })

        let check_user_exist = await user.findOne({_id: buyer_id, status:1})

        if (!check_user_exist) return res.status(400).send({ status: 400, message: 'Buyer does not exist to purchase the product' }) // additional validation to handle edge case

        let custom_msg = []
        let direct_profit = +amount * 0.05
        let indirect_profit = +amount * 0.01

        if (check_user_exist.parent_id && +amount > 1000) {

            let check_parent_user = await user.findOneAndUpdate({ _id: check_user_exist.parent_id, status: 1 }, {$inc: {earnings: direct_profit}}, {new: true}) // here parent user exist and active condition is checking
            
            if (check_parent_user) {

                await earning.create({ user_id: check_user_exist.parent_id, buyer_id: buyer_id, direct_profit: direct_profit }) //here direct earning is being created
 
                custom_msg.push(`${check_parent_user.name} (userId: ${check_parent_user._id}) got direct earning of Rs ${direct_profit} from the purchase of ${check_user_exist.name} (userId: ${check_user_exist._id}). Till now his total earning is Rs ${check_parent_user.earnings}.`)

                let parents_parent_user = await user.findOneAndUpdate({ referral_ids: { $in: [check_parent_user._id] }, status: 1 }, {$inc: {earnings: indirect_profit}}, {new: true}) // here parent's parent user existance is being checked

                if (parents_parent_user) {
                    await earning.create({ user_id: parents_parent_user._id, buyer_id: buyer_id, indirect_profit: indirect_profit }) // here indirect profit is being created
                    custom_msg.push(`${parents_parent_user.name} (userId: ${parents_parent_user._id}) got indirect earning of Rs ${indirect_profit} from the purchase of ${check_user_exist.name} (userId: ${check_user_exist._id}). Till now his total earning is Rs ${parents_parent_user.earnings}.`)
                }
            }
        }
        await purchase.create(req.body) // here purchase is being created.

        return res.status(200).send({status: 200, message:'Purchased successfully', data: custom_msg})
    } catch (err) {
        return res.status(500).send({ status: 500, message: "Internal Server Error", error: err.message })
    }
}

exports.purchase_view = (req, res) => {
    let token = req.params.token
    // console.log(token,"token")
    
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY, { ignoreExpiration: true }, //avoid the invalid error
        function (err, decodedToken) {
            if (err){
                return res.render('login', { layout: 'layouts/auth_layout' });
                // return res.status(403).send({ status: 403, message: "Invalid Token" });
            } 
            if (Date.now() > decodedToken.exp * 1000) {
                return res.render('login', { layout: 'layouts/auth_layout' });
            }
            return decodedToken
        })
    res.render('purchase', { layout: 'layouts/auth_layout', user:  decodedToken }); // Render purchase page
}