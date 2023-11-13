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
        saveData,
      });
    }
  } catch (error) {
    console.log("catch bloack active due to__", error);
    return res.json({ message: error.message.split(": ")[2] });
  }
};

//login user
exports.login_user = async (req, res) => {
  const { email, pw } = req.body;
  try {
    // if (!email || !pw)
    //     return res.send({
    //         message: "Please enter all the fields for login",
    //         success: false
    //     })
    const loginDetails = await userModel.findOne({ email, pw });
    if (!loginDetails)
      return res.send({
        message: "Invalid credentials",
        success: false,
      });
    return res.send({
      message: "Login Successful",
      success: true,
      loginDetails: { id: loginDetails._id, email: loginDetails.email},
      userInfo:{email:loginDetails.email,firstName:loginDetails.firstName,lastName:loginDetails.lastName,totalProject:loginDetails.projects.length}
    });
  } catch (error) {
    console.log("Catch block active in login due to ___", error);
    return res.json({ message: error.message.split(": ")[2] });
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
    const isUser = await userModel.findOne({ email, _id: id });
    console.log(isUser)
    if (isUser) return res.json({ success: true,
      userInfo:{firstName:isUser.firstName,lastName:isUser.lastName,totalProject:isUser.projects.length,email:isUser.email}
   });
  } catch (error) {
    return res.json({ message: "Some error occured",
   });
  }
};
