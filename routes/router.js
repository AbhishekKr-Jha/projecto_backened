const express=require('express')

const router=new express.Router()

const {register_user, login_user, delete_Account, change_password, checkLogin}=require('../controllers/user_controller')
const { send_OTP, verify_OTP } = require('../controllers/email-otp_controllers')
const { addProject, deleteProject, getProject, updateProject } = require('../controllers/project_controller')
const { commentProject, getComment, replyComment } = require('../controllers/comment_controller')

//todo ____registering user
router.post('/users/v1/register',register_user)

//todo ____check user login
router.get('/users/v1/checkLogin/:id/:email',checkLogin)

//todo ____login user
router.post('/users/v1/login',login_user)

//todo _____delete account
router.delete('/users/v1/deleteAccount',delete_Account)

//todo _____change password
router.post('/users/v1/changePassword',change_password)


//todo ____sending OTP
router.post('/users/v1/send_otp',send_OTP)

//todo ____verifying OTP
router.post('/users/v1/otp_verification',verify_OTP)



//todo ____get Project
router.get('/users/v1/getProject/:email',getProject)

//todo ____add Project
router.post('/users/v1/addProject',addProject)

//todo ____delete Project
router.delete('/users/v1/deleteProject/:user/:title',deleteProject)

//todo ____update Project
router.put('/users/v1/updateProject',updateProject)




//todo ______get comment of a project
router.get('/users/v1/getComments/:projectId',getComment)

//todo ______commenting on a project
router.post('/users/v1/commentProject',commentProject)

//todo ______reply the comment of a project
router.post('/users/v1/replyComment',replyComment)






module.exports=router