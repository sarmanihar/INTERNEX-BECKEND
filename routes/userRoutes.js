const express = require("express");
const router = express.Router();
/* createUser=>automatically*/
/*get user =>need instruction */
/*delete later on */
const {
    isAuthenticated,
    createUser,
    getUser,
    deleteProfile,
    getAll,
    updateProfile

} = require("../controllers/userController");

router.post("/", isAuthenticated, createUser);
router.get("/", getAll);
router.get("/:user_id", getUser);
router.delete("/", isAuthenticated, deleteProfile);
// router.delete("/:uid", deleteProfile);
router.patch("/", isAuthenticated, updateProfile);

module.exports = router;