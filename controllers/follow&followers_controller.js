const userModel = require("../schema/User_schema");

//todo----    andhra
//todo ---- follow people
exports.followPeople = async (req, res) => {
  const { userId, followedPersonName, followedPersonEmail } = req.body;
  try {
    const userExist = await userModel.findById(userId);
    if (!userExist)
      return res.json({ message: "User is not available", success: false });
    const followedPerson = await userModel.findOne({
      email: followedPersonEmail,
    });

    const isInFollowing = followedPerson.following.some(
      (item) => item.email === userExist.email
    );

    const isInFollowers = userExist.followers.some(
      (item) => item.email === followedPerson.email
    );
    const a = followedPerson.followers;

    if (isInFollowers) {
      await userModel.findOneAndUpdate(
        { "_id": userId,  "followers.email": followedPerson.email },
        { $set: { "followers.$.userStatus": true } },
        { new: true }
      );
    }

    userExist.following.push({
      userIdentity: followedPersonName,
      email: followedPersonEmail,
    });
   await  userExist.save();

    followedPerson.followers.push({
      userIdentity: userExist.firstName + " " + userExist.lastName,
      email: userExist.email,
      userStatus: isInFollowing || isInFollowers,
    });
    await followedPerson.save();
    const updated_userExist = await userModel.findById(userId);
    const updated_unFollowedPerson = await userModel.findOne({
      email: followedPersonEmail,
    });
    return res.json({
      message: "followed successfully",
      success: true,
     
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

    const isInFollowing = unFollowedPerson.following.some(
      (item) => item.email === userExist.email
    );

    const isInFollowers = userExist.followers.some(
      (item) => item.email === unFollowedPerson.email
    );

    if (isInFollowers) {
      await userModel.findOneAndUpdate(
        { _id: userId, "followers.email": unFollowedPerson.email },
        { $set: { "followers.$.userStatus": false } },
        { new: true }
      );
    }
    userExist.following.pull({
      userIdentity: unFollowedPersonName,
      email: unFollowedPersonEmail,
      userStatus: true,
    });
  await userExist.save();
    unFollowedPerson.followers.pull({
      userIdentity: userExist.firstName + " " + userExist.lastName,
      email: userExist.email,
      userStatus: isInFollowing,
    });
    await unFollowedPerson.save();
    const updated_userExist = await userModel.findById(userId);
    const updated_unFollowedPerson = await userModel.findOne({
      email: unFollowedPersonEmail,
    });
    return res.json({
      message: "unfollowed success",
      success: true,
      following: updated_userExist.following,
      followers: updated_userExist.followers,
      other_follower:updated_unFollowedPerson.followers,
      other_following:updated_unFollowedPerson.following
    });
  } catch (error) {
    console.log("catch bloack in unfollow active due to__", error);
    return res.json({
      message: error,
      success: false,
    });
  }
};
