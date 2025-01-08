const user = require("../models/user_model")
const bcrypt = require("bcrypt")
const saltRounds = 10


exports.register_view = async (req, res) => {
    let get_data = await user.find({
        $expr: {
            $lt: [{ $size: "$referral_ids" }, 8]
        }, status: 1
    }).select({ _id: 1, name: 1 })

    res.render('register', { layout: 'layouts/auth_layout', users: get_data  }); // Render registration page with users
  }

exports.create_user = async (req, res) => {
    try {
        let error_exist = throw_error(req)
        if (error_exist) return res.status(400).send(error_exist)

        let { email, password, parent_id } = req.body

        let is_already_register = await user.findOne({ email: email })

        if (is_already_register) return res.status(400).send({ status: 400, message: 'Email already in use' })

        req.body.password = bcrypt.hashSync(password, saltRounds)

        let save_data = await user.create(req.body)

        if (parent_id) {
            let check_user = await user.findOneAndUpdate({ _id: parent_id, status: 1 }, { $push: { referral_ids: save_data._id } }, { new: true })
            // console.log(check_user, "check_user")
        }

        return res.status(201).send({ status: 201, message: "User registered successfully" })
    } catch (err) {
        return res.status(500).send({ status: 500, message: "Internal Server Error", error: err.message })
    }
}

/* This api functionality has been used inside register_view function.
exports.get_users_for_referral = async (req, res) => {
    try {
        let get_data = await users.find({
            $expr: {
                $lt: [{ $size: "$referral_ids" }, 8]
            }, status: 1
        }).select({ _id: 1, name: 1 })

        return res.status(200).send({ status: 200, message: "Referral List", get_data })

    } catch (err) {
        return res.status(500).send({ status: 500, message: "Internal Server Error", error: err.message })
    }
}

*/