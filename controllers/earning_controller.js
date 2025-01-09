const earning = require("../models/earning_model")
const user = require("../models/user_model")

exports.earning_view = async (req, res) => {
    const { user_id } = req.query

    let get_data = await earning.find({ user_id: user_id }).populate('user_id', 'name earnings').populate("buyer_id", "name")

    res.render('earning', { layout: 'layouts/auth_layout', data: get_data }); // Render earning page
}

// this api functionality has been covered inside earning_view function.
exports.get_my_earning_details = async (req, res) => {
    try {
        const { user_id } = req.query
            let get_data = await earning.find({user_id: user_id}).populate('user_id', 'name earnings').populate("buyer_id", "name")
        return res.status(200).send({ status: 200, message: 'Purchased successfully', data: get_data })
    } catch (err) {
        return res.status(500).send({ status: 500, message: "Internal Server Error", error: err.message })
    }
}
