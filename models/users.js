const mongoose = require("mongoose");
// const { validateEmail, validateScholarID } = require("../utils/validators");

const userSchema = new mongoose.Schema({
    UID: {
        type: String,
        // default: null,
        // required: true,
        // unique: true,
    },
    name: {
        type: String,
        // default: null,
        // required: true,
        // trim: true,
    },
    email: {
        type: String,
        // default: null,
        // required: true,
        // unique: true,
        // trim: true,
        lowercase: true,
        // validate: {
        //     validator: validateEmail,
        //     message: "please enter a valid email [must be insitute email id]",
        // },
    },
    personalPosts: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Posts",
        default: [],
    },
    liked_posts: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Posts",
        default: [],
    },
    avatar: {
        type: String,
        // default: null,
        // required: true,
    },
    instagram: {
        type: String,
        default: null,
    },
    linkedin: {
        type: String,
        default: null,
    },
    github: {
        type: String,
        default: null,
    },
    facebook: {
        type: String,
        default: null,
    },
    // avatar: {
    //     public_id: {
    //         type: String,
    //         required: true,
    //     },
    //     url: {
    //         type: String,
    //         required: true,
    //     },
    // },
});

const User = mongoose.model("User", userSchema);

module.exports = User;