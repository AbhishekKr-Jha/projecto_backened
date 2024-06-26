const projectModel = require("../schema/Project_schema");
const userModel = require("../schema/User_schema");
const commentModel=require("../schema/Comment_schema")
const mongoose = require("mongoose");

//todo ______get projects
exports.getProject = async (req, res) => {
  const { email, userEmail } = req.params;
  try {
    const userExist = await userModel.findOne({ email }).populate("projects");
    const myEmail = await userExist?.followers.find(
      (user) => user.email === userEmail
    );
    if (!userExist) {
      return res.json({ message: "user not available ", success: false });
    } else {
      return res.json({
        message: " Project Fetched Successfully",
        success: true,
        projects: userExist.projects,
        userDetails: {
          userName: userExist.firstName + " " + userExist.lastName,
          email: userExist.email,
          projects: userExist.projects,
          followers: userExist.followers,
          following: userExist.following,

          socialise: myEmail ? "not undefined" : "undefined",
          social: myEmail ? "UnFollow" : "Follow",
          // createdAt:formattedDate
        },
      });
    }
  } catch (error) {
    console.log("catch bloack of get project active due to__", error);
    return res.json({ message: error.message.split(": ")[2] });
  }
};

//todo ______adding projects
exports.addProject = async (req, res) => {
  const { title, live, github, description, user } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(user)) {
      return res.json({
        message: "Error! Please Logout And Try Again",
        success: false,
      });
    }

    const existingUser = await userModel.findById(user).populate("projects");
    if (!existingUser) {
      return res.json({
        message: "User does not exist",
        success: false,
      });
    } else {
      const existingProject = await projectModel.findOne({ title, user });
      if (existingProject) {
        return res.json({
          message:
            "project with similar title already exist in your collection",
          success: false,
        });
      }
      const saveProject = new projectModel({
        title,
        live,
        github,
        description,
        user,
      });
      await saveProject.save();
      await existingUser.projects.push(saveProject._id);
      await existingUser.save();
      return res.json({
        message: "project added successfully in your collection",
        success: true,
        projects: existingUser.projects,
      });
    }
  } catch (error) {
    // console.log(error.message.split(': ')[2].split(',')[0])
    console.log("catch bloack add project active due to__", error.message);
    return res.json({
      message: error.message.split(": ")[2].split(",")[0],
      success: false,
    });
  }
};

//todo ______deleting projects
exports.deleteProject = async (req, res) => {
  console.log(req.params);
  try {
    const { projectId,title } = req.params;
    console.log(req.params)
    const del_projectTitle = await projectModel
      .findByIdAndDelete(projectId)
      .populate("user")
      .populate("comments");
    if (del_projectTitle) {
      await del_projectTitle.user.projects.pull(del_projectTitle);
      await del_projectTitle.user.save();
      const comments_id = del_projectTitle.comments.map(comment => comment._id);
      await commentModel.deleteMany({
        _id: { $in: comments_id },
      });
      // await del_projectTitle.comments.save();
      console.log(comments_id);
      return res.json({
        message: "project was successfully deleted",
        success: true,
      });
    } else {
      return res.json({
        message: "project with given title not available in database",
        success: false,
      });
    }
  } catch (error) {
    console.log(
      "catch bloack in delete project controller active due to__",
      error
    );
    return res.json({ message: "error occured while deleting", error,success:false });
  }
};

//todo ______update projects
exports.updateProject = async (req, res) => {
  try {
    const { title, live, github, description, project_id, user } = req.body;
    console.log(req.body)
    const existingUser = await userModel.findById(user);
    if (!existingUser) {
      return res.json({
        message: "user is not available",
        success: false,
      });
    } else {
      const updateProject = await projectModel
        .findByIdAndUpdate(
          project_id,
          { title, live, github, description },
          { new: true,runValidators: true }
        )
        .exec();
        await updateProject.save();
        if(updateProject){
          return res.json({ message: "updation successful", success: true,updateProject });
        }
        else{
          res.json({message:"project not found",success:false})
        }
    }
  } catch (error) {
    console.log("catch bloack active due to__", error);
    return res.json({  message: error.message.split(": ")[2].split(",")[0],
    success: false,});
  }
};

//todo _____real time search
exports.realTimeSearch = async (req, res) => {
  try {
    const userEmails = await userModel
      .find({}, { email: 1, _id: 0 })
      .lean()
      .exec();
    if (userEmails) {
      const emailArray = userEmails.map((user) => user.email);
      return res.json({ message: "emails fetched", success: true, emailArray });
    } else {
      return res.json({ message: "some errors occured", succcess: false });
    }
  } catch (error) {
    return res.json({ message: error, success: false });
  }
};
