const userModel = require("../schema/User_schema");

exports.followPeople = async (req, res) => {
  const { userId, followedPersonName, followedPersonEmail } = req.body;
  try {
    const userExist = await userModel.findById(userId);
    if (!userExist)
      return res.json({ message: "User is not available", success: false });
    const followedPerson = await userModel.findOne({
      email: followedPersonEmail,
    });
    userExist.following.push({
      userIdentity: followedPersonName,
      email: followedPersonEmail,
    });
    await userExist.save();
    followedPerson.followers.push({
      userIdentity: userExist.firstName + " " + userExist.lastName,
      email: userExist.email,
    });
    await followedPerson.save();
    return res.json({
      message: "followed successfully",
      success: true,
      following: userExist.following,
      // followers: followedPerson.followers,
    });
  } catch (error) {
    console.log("catch bloack ain follow active due to__", error);
    return res.json({
      message: error.message,
      success: false,
    });
  }
};

//todo _____unfollow people
exports.unfollowPeople = async (req, res) => {
  const { userId, unFollowedPersonName, unFollowedPersonEmail } = req.body;
  try {
    const userExist = await userModel.findById(userId);
    if (!userExist)
      return res.json({ message: "User is not available", success: false });
    const unFollowedPerson = await userModel.findOne({
      email: unFollowedPersonEmail,
    });
    console.log("before pu;; --",unFollowedPerson)
    userExist.following.pull({
      userIdentity: unFollowedPersonName,
      email: unFollowedPersonEmail,
    });
    await userExist.save();
    unFollowedPerson.followers.pull({
      userIdentity: userExist.firstName + " " + userExist.lastName,
      email: userExist.email,
    });
    console.log("it is ",userExist.following )
    await unFollowedPerson.save();
    return res.json({
      message: "unfollowed success",
      success: true,
      following: userExist.following,
      // followers: unFollowedPerson.followers,
    });
  } catch (error) {
    console.log("catch bloack in unfollow active due to__", error);
    return res.json({
      message: error.message,
      success: false,
    });
  }
};
