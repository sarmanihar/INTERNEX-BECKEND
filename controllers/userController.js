const POSTS = require("../models/posts");
const User = require("../models/users");
const jwt = require("jsonwebtoken");
const { catchAsync } = require("../utils/errorHandler");


const admin = require('firebase-admin');
const serviceAccount = require('../firebase_admin_sdk/ServiceAccountKey.json');
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const UID = 'some-uid';

exports.isAuthenticated = catchAsync(async(req, res, next) => {
    console.log("isAuthenticated entered");
    let getToken = req.body.getToken;
    admin.auth()
        .verifyIdToken(getToken)
        .then((decodedToken) => {
            // uid = decodedToken.user_id;
            req.uSerID = decodedToken.user_id;
            req.name = decodedToken.name;
            req.email = decodedToken.email;
            req.picture = decodedToken.picture;
            next();
        })
        .catch((error) => {
            return res.status(401).json({
                status: "fail",
                message: "Not authenicated!",
            });
        });
});


exports.getUser = catchAsync(async(req, res, next) => {
    try {
        const id = req.params.user_id;
        const reqdUser = await User.findById(id).populate({
            path: "personalPosts",
        });
        return res.status(200).json({
            status: "success",
            reqdUser: reqdUser,
        });
    } catch (err) {
        // res.send('Error : ' + err)
        return res.status(500).json({
            status: "fail",
            message: err,
        });
    }
});
exports.getAll = catchAsync(async(req, res, next) => {
    try {
        const allUsers = await User.find()
        return res.status(200).json({
            status: "success",
            allUsers: allUsers,
        });
    } catch (err) {
        // res.send('Error : ' + err)
        return res.status(500).json({
            status: "fail",
            message: err,
        });
    }
});

exports.createUser = catchAsync(async(req, res, next) => {
    console.log("createUser called");
    let UID = req.uSerID;
    let name = req.name;
    let email = req.email;
    let avatar = req.picture;
    console.log(UID);
    const check = await User.findOne({ UID: UID });
    if (check) {
        return res.status(200).json({
            status: "success",
            message: "User already exists",
            ID: check._id
        });
    }
    if (!UID ||
        !name ||
        !email ||
        !avatar ||
        avatar === "undefined" ||
        UID === "undefined" ||
        name === "undefined" ||
        email === "undefined"
    ) {
        return res.status(400).json({
            status: "fail",
            message: "Please provide all the correct details/image link must be valid",
        });
    }

    const newUser = await User({
        UID: UID,
        name: name,
        email: email,
        avatar: avatar,
    }).save();

    return res.status(201).json({
        status: "success",
        message: "User Succesfully Created",
        ID: newUser._id
    });

});


exports.deleteProfile = catchAsync(async(req, res, next) => {
    console.log("Delet profile called");
    let UID = req.uSerID;
    const reqdUser = await User.findOne({ UID: UID });
    if (!reqdUser) {
        return res.status(404).json({
            status: "fail",
            message: "No such Profile exists",
        });
    }
    const allYourPosts = reqdUser.personalPosts;
    for (let ps of allYourPosts) {
        const ps_id = ps._id;
        const Post = await POSTS.findById(ps_id);
        if (Post) {
            await POSTS.findByIdAndDelete(ps_id);
        }
    }
    await User.findByIdAndDelete(reqdUser._id);
    return res.status(204).json({
        status: "success",
        message: "successfully deleted",
    });

});



exports.updateProfile = catchAsync(async(req, res, next) => {

    let UID = req.uSerID;

    const reqdUser = await User.findOne({ UID: UID });
    if (!reqdUser) {
        return res.status(404).json({
            status: "fail",
            message: "No such Profile exists",
        });
    }


    let instagram = req.body.instagram;
    let linkedin = req.body.linkedin;
    let github = req.body.github;
    let facebook = req.body.facebook;
    let name = req.body.name;

    console.log("Update profile called");
    console.log(instagram);
    if (!instagram || instagram === "null") {
        instagram = null;
    }
    if (!linkedin || linkedin === "null") {
        linkedin = null;
    }
    if (!github || github === "null") {
        github = null;
    }
    if (!facebook || facebook === "null") {
        facebook = null;
    }
    if (!name || name === "null") {
        return res.status(400).json({
            status: "fail",
            message: "Must have a Name",
        });
    }
    const updatedProfile = {
        UID: reqdUser.UID,
        name: name || reqdUser.name,
        email: reqdUser.email,
        personalPosts: reqdUser.personalPosts,
        liked_posts: reqdUser.liked_posts,
        avatar: reqdUser.avatar,
        instagram: instagram || reqdUser.instagram,
        linkedin: linkedin || reqdUser.linkedin,
        github: github || reqdUser.github,
        facebook: facebook || reqdUser.facebook,
    };

    Object.assign(reqdUser, updatedProfile);
    await reqdUser.save();

    res.status(200).json({
        status: "success",
        message: "Profile successfully updated",
        updatedProfile: updatedProfile,
    });
});