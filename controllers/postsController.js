const POSTS = require("../models/posts");
const User = require("../models/users");
const cloudinary = require("cloudinary");
const { json } = require("body-parser");
require("dotenv").config();



const { catchAsync, AppError } = require("../utils/errorHandler");


exports.getAllPosts = catchAsync(async(req, res, next) => {
    // console.log("ok\n");
    // const allPosts = await POSTS.populate('user').find();
    // const allPosts = await POSTS.find();
    // console.log(allPosts);
    // return allPosts;

    try {
        const allPosts = await POSTS.find().populate({
                path: "user",
                select: "name avatar instagram linkedin github facebook",
            })
            // console.log(allPosts);

        return res.status(200).json({
            status: "success",
            AllPosts: allPosts,
        });
    } catch (err) {
        // res.send('Error : ' + err)
        return res.status(500).json({
            status: "fail",
            message: err,
        });
    }
});


exports.createPosts = catchAsync(async(req, res, next) => {
    console.log("createPosts entered");
    console.log("ok\n");
    // const {user, name, description, postDate, postTime, coverPic } =
    // req.body;
    // const userId = req.user._id;
    // let userId = req.body.user_id;
    let uSerID = req.uSerID;
    console.log(uSerID);
    const check = await User.findOne({ UID: uSerID });
    let userId = check._id;
    console.log(userId);
    // console.log("\n\n" + userId + "\n\n");
    let coverPic = req.body.coverPic;
    if (!coverPic || coverPic === "undefined") {
        coverPic = null;
    }
    let instagram = req.body.instagram;
    let linkedin = req.body.linkedin;
    let github = req.body.github;
    let facebook = req.body.facebook;
    let name = req.body.name;
    let Question = req.body.Question;
    if (!Question || Question === "undefined") {
        Question = null;
    }
    let Intuition = req.body.Intuition;
    if (!Intuition || Intuition === "undefined") {
        Intuition = null;
    }
    let Approach = req.body.Approach;
    if (!Approach || Approach === "undefined") {
        Approach = null;
    }
    let Code = req.body.Code;
    if (!Code || Code === "undefined") {
        Code = null;
    }
    let TimC = req.body.TimC;
    if (!TimC || TimC === "undefined") {
        TimC = null;
    }
    let SpaceC = req.body.SpaceC;
    if (!SpaceC || SpaceC === "undefined") {
        SpaceC = null;
    }
    let Experince = req.body.Experince;
    if (!Experince || Experince === "undefined") {
        Experince = null;
    }
    let noOfLikes = req.body.noOfLikes;
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let postDate = (year + "-" + month + "-" + date);

    // const name=req.body.name;
    // const description=req.body.description;
    // const postDate=req.body.postDate;
    // const postTime=req.body.postTime;

    // const coverPic = req.body.coverPic;
    // console.log(coverPic.slice(0, 20));

    if (!name || name === "undefined") {
        return res.status(400).json({
            status: "fail",
            message: "Must have a title",
        });
    }
    if (!(Question || Intuition || Approach || Experince) || (Question === "undefined" && Intuition === "undefined" &&
            Approach === "undefined" && Experince === "undefined"
        )) {
        return res.status(400).json({
            status: "fail",
            message: "Must have a Question/Intuition/Approach/Experince",
        });
    }
    // if (coverPic != null && coverPic === "undefined") {
    //     return res.status(400).json({
    //         status: "fail",
    //         message: "given photo is undefined",
    //     });
    // }



    // let myCloud = {
    //     public_id: null,
    //     url: null,
    // };
    // try {
    //     myCloud = await cloudinary.v2.uploader.upload(coverPic
    //         //     , {
    //         //     proxy: "http://172.16.199.40:8080",
    //         //     folder: "test-folder"
    //         // }
    //     );
    //     console.log({ myCloud })
    // } catch (error) {
    //     console.log(error)
    // }
    // const userId = req.user._id;
    const newPost = await POSTS({
        user: userId,
        name: name,
        Question: Question,
        Intuition: Intuition,
        Approach: Approach,
        Code: Code,
        TimC: TimC,
        SpaceC: SpaceC,
        Experince: Experince,
        noOfLikes: noOfLikes,
        postDate: postDate,
        instagram: instagram,
        linkedin: linkedin,
        github: github,
        facebook: facebook,
        coverPic: coverPic,
        // coverPic: {
        //     public_id: myCloud.public_id,
        //     url: myCloud.url,
        // },
    }).save();

    const uSer = await User.findById(userId);
    uSer.personalPosts.push(newPost._id);
    await uSer.save();
    return res.status(201).json({
        status: "success",
        message: "Event Succesfully Created",
        newPost: newPost,
    });
});

exports.updatePost = catchAsync(async(req, res, next) => {
    let uSerID = req.uSerID;
    const check = await User.findOne({ UID: uSerID });
    let userId = check._id;

    console.log("ok.Update post called\n");
    let instagram = req.body.instagram;
    let linkedin = req.body.linkedin;
    let github = req.body.github;
    let facebook = req.body.facebook;
    let id = req.params.post_id;

    let Post = await POSTS.findById(id);

    if (!Post) {
        return res.status(404).json({
            status: "fail",
            message: "No such post exists",
        });
    }
    let compUserId = Post.user;
    let postId = Post._id;
    // console.log(compUserId);
    // console.log(userId);

    if (!(userId.equals(compUserId))) {
        console.log("wrong place")
        return res.status(403).json({
            status: "fail",
            message: "This post doesnot belongs to you",
        });
    }
    // let contain = check.personalPosts.includes(postId);
    // if (!contain) {
    //     console.log("wrong place")
    //     return res.status(400).json({
    //         status: "fail",
    //         message: "This post doesnot belongs to you",
    //     });
    // }
    let coverPic = Post.coverPic || req.body.coverPic;
    if (!coverPic || coverPic === "null") {
        coverPic = null;
    }
    // if (req.body.coverPic && req.body.coverPic != "undefined") {
    //     const imageId = Post.coverPic.public_id;
    //     await cloudinary.v2.uploader.destroy(imageId);
    //     const myCloud = await cloudinary.v2.uploader.upload(req.body.coverPic, {
    //         api_key: process.env.CLOUDINARY_API_KEY,
    //         api_secret: process.env.CLOUDINARY_API_SECRET,
    //         cloud_name: process.env.CLOUDINARY_NAME,
    //     });
    //     newCoverPic.public_id = myCloud.public_id;
    //     newCoverPic.url = myCloud.url;
    // }

    // const { name, description, postDate, postTime } = req.body;
    let name = req.body.name;
    let Question = req.body.Question;
    if (!Question || Question === "null") {
        Question = null;
    }
    let Intuition = req.body.Intuition;
    if (!Intuition || Intuition === "null") {
        Intuition = null;
    }
    let Approach = req.body.Approach;
    console.log(Approach);
    if (!Approach || Approach === "null") {
        Approach = null;
    }
    let Code = req.body.Code;
    if (!Code || Code === "null") {
        Code = null;
    }
    let TimC = req.body.TimC;
    if (!TimC || TimC === "null") {
        TimC = null;
    }
    let SpaceC = req.body.SpaceC;
    if (!SpaceC || SpaceC === "null") {
        SpaceC = null;
    }
    let Experince = req.body.Experince;
    if (!Experince || Experince === "null") {
        Experince = null;
    }


    if (!name || name === "null") {
        return res.status(400).json({
            status: "fail",
            message: "Must have a title",
        });
    }
    if (!(Question || Intuition || Approach || Experince) || (Question === "null" && Intuition === "null" &&
            Approach === "null" && Experince === "null"
        )) {
        return res.status(400).json({
            status: "fail",
            message: "Must have a Question/Intuition/Approach/Experince",
        });
    }


    const updatePosts = {
        user: Post.user,
        name: name || Post.name,
        Question: Question || Post.Question,
        Intuition: Intuition || Post.Intuition,
        Approach: Approach || Post.Approach,
        Code: Code || Post.Code,
        TimC: TimC || Post.TimC,
        SpaceC: SpaceC || Post.SpaceC,
        Experince: Experince || Post.Experince,
        noOfLikes: Post.noOfLikes,
        postDate: Post.postDate,
        instagram: instagram || Post.instagram,
        linkedin: linkedin || Post.linkedin,
        github: github || Post.github,
        facebook: facebook || Post.facebook,
        coverPic: coverPic,
    };

    Object.assign(Post, updatePosts);
    await Post.save();

    res.status(200).json({
        status: "success",
        message: "Post successfully updated",
        updatedPost: updatePosts,
    });
});

exports.deletePost = catchAsync(async(req, res, next) => {
    let uSerID = req.uSerID;
    const check = await User.findOne({ UID: uSerID });
    let userId = check._id;
    console.log("ok.delete post called\n");
    //  const userId = req.user._id;


    // const userId = req.body.user_id;
    // const uSer = await User.findById(userId);

    const id = req.params.post_id;
    const Post = await POSTS.findById(id);

    if (!Post) {
        return res.status(404).json({
            status: "fail",
            message: "No such post exists",
        });
    }

    let compUserId = Post.user;
    if (!(userId.equals(compUserId))) {
        console.log("wrong place")
        return res.status(403).json({
            status: "fail",
            message: "This post doesnot belongs to you",
        });
    }
    check.personalPosts = check.personalPosts.filter((id) => !id.equals(req.params.post_id));
    await check.save();
    //  const imageId = Post.coverPic?.public_id;
    // const imageId = "";
    // if (imageId) {
    //     await cloudinary.v2.uploader.destroy(imageId);
    // }
    await POSTS.findByIdAndDelete(id);

    return res.status(204).json({
        status: "success",
        message: "successfully deleted",
    });
});
exports.likedPost = catchAsync(async(req, res, next) => {
    console.log("likedPost called\n");
    // const userId = req.user._id;
    // const userId = req.params.user_id;
    let uSerID = req.uSerID;
    const check = await User.findOne({ UID: uSerID });
    let userId = check._id;
    // const userId = req.body.user_id;
    const uSer = await User.findById(userId);
    const id = req.params.post_id;
    const Post = await POSTS.findById(id);
    if (!Post) {
        return res.status(404).json({
            status: "fail",
            message: "No such Post exists",
        });
    }
    // const isLiked = uSer.liked_posts.findById(id);
    const isLiked = uSer.liked_posts.includes(id);
    // if (isLiked) {
    //     console.log("\ngot it.\n");
    // } else {
    //     console.log("\nnope bro\n");
    // }
    if (!isLiked) {
        uSer.liked_posts.push(id);
        await uSer.save();
        let cnt = Post.noOfLikes;
        Post.noOfLikes = cnt + 1;
        await Post.save();
    } else {
        let cnt = Post.noOfLikes;
        Post.noOfLikes = cnt - 1;
        await Post.save();
        uSer.liked_posts = uSer.liked_posts.filter((id) => !id.equals(req.params.post_id));
        await uSer.save();
    }

    return res.status(200).json({
        status: "success",
        CountN: Post.noOfLikes
    });
});