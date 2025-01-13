const { default: mongoose } = require("mongoose")
const earning = require("../models/earning_model")
const user = require("../models/user_model")

exports.earning_view = async (req, res) => {
    let { user_id } = req.query
    
    user_id = new mongoose.Types.ObjectId(user_id)
    // console.log(user_id, "user_id")

    // let get_data = await earning.find({ user_id: user_id }).populate('user_id', 'name earnings').populate("buyer_id", "name")

    let get_data = await earning.aggregate([
        { $match: { user_id: user_id } },
        {
            $group: {
                _id: "$buyer_id", // Group by buyer_id
                total_direct_profit: { $sum: "$direct_profit" }, // Sum the direct_profit
                total_indirect_profit: { $sum: "$indirect_profit" }, // Sum the indirect_profit
                user_id: { $first: "$user_id" }, // Get user_id details
                buyer_id: { $first: "$buyer_id" }, // Get buyer_id details
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'user_id',
                foreignField: "_id",
                as: "user_id"
            }
        },
        {
            $unwind: {
                path: "$user_id",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'buyer_id',
                foreignField: "_id",
                as: "buyer_id"
            }
        },
        {
            $unwind: {
                path: "$buyer_id",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $project: {
              _id: 1,
              user_details: {
                _id: "$user_id._id",
                name: "$user_id.name",
                earnings: "$user_id.earnings",
              },
              buyer_details: {
                _id: "$buyer_id._id",
                name: "$buyer_id.name",
                earnings: "$buyer_id.earnings",
              },
              total_direct_profit: 1,
              total_indirect_profit: 1,
            },
          },
          {
            $sort: {
              _id: 1, // Ascending order by _id 
            },
          },
    ])
    // console.log(get_data, "get_data")
    res.render('earning', { layout: 'layouts/auth_layout', data: get_data }); // Render earning page
}

// this api functionality has been covered inside earning_view function.
exports.get_my_earning_details = async (req, res) => {
    try {
        let { user_id } = req.query

        user_id = new mongoose.Types.ObjectId(user_id)

        // let get_data = await earning.find({user_id: user_id}).populate('user_id', 'name earnings').populate("buyer_id", "name")

        let get_data = await earning.aggregate([
            { $match: { user_id: user_id } },
            {
                $group: {
                    _id: "$buyer_id", // Group by buyer_id
                    total_direct_profit: { $sum: "$direct_profit" }, // Sum the direct_profit
                    total_indirect_profit: { $sum: "$indirect_profit" }, // Sum the indirect_profit
                    user_id: { $first: "$user_id" }, // Get user_id details
                    buyer_id: { $first: "$buyer_id" }, // Get buyer_id details
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: "_id",
                    as: "user_id"
                }
            },
            {
                $unwind: {
                    path: "$user_id",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'buyer_id',
                    foreignField: "_id",
                    as: "buyer_id"
                }
            },
            {
                $unwind: {
                    path: "$buyer_id",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                  _id: 1,
                  user_details: {
                    _id: "$user_id._id",
                    name: "$user_id.name",
                    earnings: "$user_id.earnings",
                  },
                  buyer_details: {
                    _id: "$buyer_id._id",
                    name: "$buyer_id.name",
                    earnings: "$buyer_id.earnings",
                  },
                  total_direct_profit: 1,
                  total_indirect_profit: 1,
                },
              },
              {
                $sort: {
                  _id: 1, // Ascending order by _id 
                },
              },

        ])
        return res.status(200).send({ status: 200, message: 'My earning details', data: get_data })
    } catch (err) {
        return res.status(500).send({ status: 500, message: "Internal Server Error", error: err.message })
    }
}
