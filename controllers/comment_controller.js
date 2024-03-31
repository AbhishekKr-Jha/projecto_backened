const commentModel = require("../schema/Comment_schema");
const projectModel = require("../schema/Project_schema");
const userModel = require("../schema/User_schema");

//get comment --------
exports.getComment = async (req, res) => {
  const { projectId } = req.params;
  // console.log("id is",projectId)
  try {
    if (!projectId) {
      return res.json({ message: "projectId not found", success: false });
    }
    const isProject = await projectModel
      .findById(projectId)
      ?.populate("comments");
    if (!isProject) {
      return res.json({ message: "project do not exist", success: false });
    }
    console.log("comments--", isProject.comments);
    return res.json({
      message: "comment fetched successfully",
      success: true,
      // creator:isProject.user,
      comments: isProject.comments,
    });
  } catch (error) {
    console.log("catch block of get comment active due to__", error);
    return res.json({ message: error.message.split(": ")[2] });
  }
};

//craete coomment----
exports.commentProject = async (req, res) => {
  const { projectId, comment, userId } = req.body;
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ message: "you are not a user", success: false });
    }
    const isProject = await projectModel.findById(projectId).populate("user");
    if (!isProject) {
      return res.json({ message: "Project not available", success: false });
    }
    const userName =  user.firstName + " " + user.lastName;
    const projectComment = new commentModel({
      projectId,
      comment,
      user: userName,
    });

    await projectComment.save();
    console.log("ok");
    console.log(projectComment);
    isProject.comments.push(projectComment._id);
    await isProject.save();
    return res.json({
      message: "comment added successfully",
      success: true,
      comment: projectComment,
    });
  } catch (error) {
    console.log("catch bloack active due to__", error);
    return res.json({ message: error.message.split(": ")[2] });
  }
};

//reply comment
exports.replyComment = async (req, res) => {
  const { commentId, projectId, userId, reply } = req.body;
  console.log("--", commentId, projectId, userId, reply);
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ message: "you are not a user", success: false });
    }
    const isProject = await projectModel.findById(projectId).populate("user");
    if (!isProject) {
      return res.json({ message: "Project not available", success: false });
    }
    const commentReply = await commentModel
      .findByIdAndUpdate(commentId, { reply }, { new: true })
      .exec();
    await commentReply.save();
    return res.json({
      message: "replied successfully",
      success: true,
      reply: commentReply.reply,
    });
  } catch (error) {
    console.log("catch bloack active due to__", error);
    return res.json({ message: error.message.split(": ")[2] });
  }
};
