const user = require("../models/user_model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const saltRounds = 10
// const {io} = require('../index');


exports.register_view = async (req, res) => {
    let get_data = await user.find({
        $expr: {
            $lt: [{ $size: "$referral_ids" }, 8]
        }, status: 1
    }).select({ _id: 1, name: 1 })

    res.render('register', { layout: 'layouts/auth_layout', users: get_data }); // Render registration page with users
}

exports.login_view = (req, res) => {
    res.render('login', { layout: 'layouts/auth_layout' }); // Render login page
}

exports.create_user = async (req, res) => {
    try {
        let error_exist = throw_error(req)
        if (error_exist) return res.status(400).send(error_exist)

        let { email, password, parent_id } = req.body

        let is_already_register = await user.findOne({ email: email })

        if (is_already_register) {
                // io.emit('registrationError', 'Email already in use');
            return res.status(400).send({ status: 400, message: 'Email already in use' })
        }

        req.body.password = bcrypt.hashSync(password, saltRounds)

        let save_data = await user.create(req.body)

        if (parent_id) {
            let check_user = await user.findOneAndUpdate({ _id: parent_id, status: 1 }, { $push: { referral_ids: save_data._id } }, { new: true })
            // console.log(check_user, "check_user")
        }
            // io.emit('registrationSuccess', 'User registered successfully');
        return res.status(201).send({ status: 201, message: "User registered successfully" })
    } catch (err) {
            // io.emit('registrationError', 'An error occurred during registration');
        return res.status(500).send({ status: 500, message: "Internal Server Error", error: err.message })
    }
}

exports.user_login = async (req, res) => {
    try {
        let error_exist = throw_error(req)
        if (error_exist) return res.status(400).send(error_exist)

        let { email, password } = req.body
        let user_data = await user.findOne({ email: email })
        if (!user_data) return res.status(401).send({ status: 401, message: "Email is not registered" })

        bcrypt.compare(password, user_data.password, (err, result)=> {

            if (result) {
                // console.log("It matches!")
                const token = jwt.sign({
                    _id: user_data._id,
                    name: user_data.name,
                    iat: Math.floor(Date.now() / 1000),
                    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60 //expiry time is 24 hours ///2.56=>2
                }, process.env.SECRET_KEY)

                return res.status(200).send({ status: 200, message: 'Login successfully', token: token })
            }
            return res.status(401).send({ status: 401, message: "Invalid credentials" })
        });

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