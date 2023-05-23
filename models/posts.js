const mongoose = require("mongoose");
// const {
//     validateDate,
//     validateTime,
// } = require("../utils/validators");

const postsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // default: null,
        // required: true,
        // unique: true,
    },
    name: {
        type: String,
        required: true,
        // default: null,
        // trim: true,
    },
    Question: {
        type: String,
        // default: null,
    },
    Intuition: {
        type: String,
        // default: null,
    },
    Approach: {
        type: String,
        // default: null,
    },
    Code: {
        type: String,
        // default: null,
    },
    TimC: {
        type: String,
        // default: null,
    },
    SpaceC: {
        type: String,
        // default: null,
    },
    Experince: {
        type: String,
        // default: null,
    },
    postDate: {
        type: String,
        // default: null,
        // required: true,
        // validate: {
        //     validator: validateDate,
        //     message: "invalid post date",
        // },
    },
    noOfLikes: {
        type: Number,
        default: 0,
    },
    coverPic: {
        type: String,
        default: null,
    },
    // coverPic: {
    //     public_id: {
    //         type: String,
    //     },
    //     url: {
    //         type: String,
    //     },
    // },
});

const POSTS = mongoose.model("Posts", postsSchema);

module.exports = POSTS;