const userModel = require("../schema/User_schema");

//register user
exports.register_user = async (req, res) => {
  const { firstName, lastName, email, pw, cpw } = req.body;
  try {
    const preUser = await userModel.findOne({ email });
    if (preUser) {
      return res.json({ message: "Email already exist", success: false });
    } else {
      const newUser = new userModel({ firstName, lastName, email, pw, cpw });
      const saveData = await newUser.save();
      return res.json({
        message: "User registered successfully",
        success: true,
        // saveData,
      });
    }
  } catch (error) {
    console.log("catch bloack active due to__", error);
    return res.json({ message: error.message.split(": ")[2], success: false });
  }
};

//login user
exports.login_user = async (req, res) => {
  const { email, pw } = req.body;

  try {
    const loginDetails = await userModel
      .findOne({ email, pw })
      .populate("projects");
    if (!loginDetails)
      return res.json({
        good: "green",
        message: "Invalid credentials",
        success: false,
      });
    return res.json({
      message: "Login Successful",
      success: true,
      loginDetails: { id: loginDetails._id, email: loginDetails.email },
      userInfo: {
        email: loginDetails.email,
        firstName: loginDetails.firstName,
        lastName: loginDetails.lastName,
        totalProject: loginDetails.projects.length,
        followers: loginDetails.followers,
        following: loginDetails.following,
        contact: {
          linkedin: loginDetails.linkedin,
          instagram: loginDetails.instagram,
          github: loginDetails.github,
          projects: loginDetails.projects,
        },
      },
    });
  } catch (error) {
    console.log("Catch block active in login due to ___", error);
    return res.json({ message: error.message.split(": ")[2], success: false });
  }
};

//update profile of the user
exports.updateUserProfile = async (req, res) => {
  const { firstName, lastName, linkedin, instagram, github, userId } = req.body;
  try {
    const userExist = await userModel.findById(userId);
    if (!userExist) {
      return res.json({
        message: "user does not exist in database",
        success: false,
      });
    }
    const userDataUpdation = await userModel
      .findByIdAndUpdate(
        userId,
        { firstName, lastName, linkedin, instagram, github },
        { new: true }
      )
      .exec();
    await userDataUpdation.save();
    return res.json({
      message: "updation successful",
      success: true,
      userInfo: {
        firstName: userDataUpdation.firstName,
        lastName: userDataUpdation.lastName,
        contact: {
          linkedin: userDataUpdation.linkedin,
          instagram: userDataUpdation.instagram,
          github: userDataUpdation.github,
        },
      },
    });
  } catch (error) {
    console.log("Catch block active in update_user_profile due to ___", error);
    return res.json({ message: error.message, success: false });
  }
};

//delete user account
exports.delete_Account = async (req, res) => {
  try {
    const { user } = req.body;
    const userExist = await userModel.findById(user);
    if (!userExist) {
      return res.json({
        message: "user does not exist in database",
        success: false,
      });
    } else {
      const delete_Account = await userModel.findByIdAndDelete(user);
      console.log(delete_Account);
      return res.json({
        message: "user successfully deleted from database",
        success: true,
      });
    }
  } catch (error) {
    console.log("Catch block active in delete_account due to ___", error);
    return res.json(`catch block in delete_account active due to__${error}`);
  }
};

//change password
exports.change_password = async (req, res) => {
  const { user, new_password } = req.body;
  try {
    const userExist = await userModel.findById(user);
    if (!userExist) {
      return res.json({ message: "user does not exist", success: false });
    } else {
      const change_password = await userModel
        .findByIdAndUpdate(
          user,
          { pw: new_password, cpw: new_password },
          { new: true }
        )
        .exec();
      await change_password.save();
      return res.json({
        message: "Password field updated successfully",
        success: true,
      });
    }
  } catch (error) {
    console.log("Catch block active in change_password due to ___", error);
    return res.json(`catch block in change_password active due to__${error}`);
  }
};

//checking login or not
exports.checkLogin = async (req, res) => {
  const { email, id } = req.params;
  try {
    const isUser = await userModel
      .findOne({ email, _id: id })
      .populate("projects");
    // console.log(isUser);
    if (isUser)
      return res.json({
        success: true,
        userInfo: {
          followers: isUser.followers,
          following: isUser.following,
          firstName: isUser.firstName,
          lastName: isUser.lastName,
          totalProject: isUser.projects.length,
          email: isUser.email,
          userId: isUser._id,
          contact: {
            linkedin: isUser.linkedin,
            instagram: isUser.instagram,
            github: isUser.github,
          },
          projects: isUser.projects,
        },
      });
      else{
        return res.json({success:false,message:"User not found"})
      }
  } catch (error) {
    return res.json({
      success:false,
      message: "Some error occured",
      err: error.message,
      problem: error,
    });
  }
};

exports.delFollow = async (req, res) => {
  try {
    const data = await userModel.updateMany(
      {},
      { $unset: { followers: "", following: "" } }
    );
    const my = await userModel.find({});
    res.json({ message: "message response successful", data: my });
  } catch (error) {
    res.send("message unsucces", `error is____ ${error}`);
  }
};

exports.getFollowers = async (req, res) => {
  const { email } = req.params;
  try {
    const data = await userModel.find({ email });
    if (!data) res.json({ message: "data of followers not found" });
    res.json({
      message: "data of folowers found",
      success: true,
      datas: data.followers,
    });
  } catch (error) {
    res.send("message unsucces", `error is____ ${error}`);
  }
};

exports.serverStatus=async(req,res)=>{
  return res.json({success:true})
}