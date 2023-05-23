const express = require("express");
const router = express.Router();

const {
    createPosts,
    updatePost,
    getAllPosts,
    deletePost,
    likedPost
} = require("../controllers/postsController");
const { isAuthenticated } = require("../controllers/userController");

router.get("/", getAllPosts);
router.post("/", isAuthenticated, createPosts);
router.post("/:post_id", isAuthenticated, likedPost);
router.patch("/:post_id", isAuthenticated, updatePost);
router.delete("/:post_id", isAuthenticated, deletePost);
// router.delete("/:post_id", deletePost);

module.exports = router;