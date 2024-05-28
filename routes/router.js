const express = require("express");

const router = new express.Router();

const {
  register_user,
  login_user,
  delete_Account,
  change_password,
  checkLogin,
  updateUserProfile,
  delFollow,
  getFollowers,
  serverCheck,
  serverStatus,
} = require("../controllers/user_controller");
const {
  send_OTP,
  verify_OTP,
} = require("../controllers/email-otp_controllers");
const {
  addProject,
  deleteProject,
  getProject,
  updateProject,
  realTimeSearch,
} = require("../controllers/project_controller");
const {
  commentProject,
  getComment,
  replyComment,
} = require("../controllers/comment_controller");
const {
  followPeople,
  unfollowPeople,
} = require("../controllers/follow&followers_controller");

//todo ____registering user
router.post("/users/v1/register", register_user);

//todo ____check user login
router.get("/users/v1/checkLogin/:id/:email", checkLogin);

//todo ____check server status
router.get("/users/v1/serverstatus",serverStatus);

//todo ____login user
router.post("/users/v1/login", login_user);

//todo ____update user profile
router.post("/users/v1/updateprofile", updateUserProfile);

//todo _____delete account
router.delete("/users/v1/deleteAccount", delete_Account);

//todo _____change password
router.post("/users/v1/changePassword", change_password);

//todo ____sending OTP
router.post("/users/v1/send_otp", send_OTP);

//todo ____verifying OTP
router.post("/users/v1/otp_verification", verify_OTP);

//todo ____get Project
router.get("/users/v1/getProject/:email/:userEmail", getProject);

//todo ____add Project
router.post("/users/v1/addProject", addProject);

//todo ____delete Project
router.delete("/users/v1/deleteProject/:projectId/:title", deleteProject);

//todo ____update Project
router.put("/users/v1/updateProject", updateProject);

//todo ____real time search
router.get("/users/v1/realTimeSearch", realTimeSearch);

//todo ______get comment of a project
router.get("/users/v1/getComments/:projectId", getComment);

//todo ______commenting on a project
router.post("/users/v1/commentProject", commentProject);

//todo ______reply the comment of a project
router.post("/users/v1/replyComment", replyComment);

//todo _____follw peoples
router.post("/users/v1/follow", followPeople);

//todo _____unFollw peoples
router.post("/users/v1/unfollow", unfollowPeople);



//todo _____unFollw peoples
router.get("/users/v1/delFollow", delFollow);

//todo _____unFollw peoples
router.get("/users/v1/getFollowers/:email", getFollowers);


module.exports = router;
