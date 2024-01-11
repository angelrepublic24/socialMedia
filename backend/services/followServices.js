const Follows = require("../models/follows");

const followUserIds = async (identifyUserId) => {
  try {
    // get info of following
    let following = await Follows.find({ user: identifyUserId })
      .select({ followed: 1, _id: 0 })
      .then((follows) => follows);

    let followers = await Follows.find({ followed: identifyUserId })
      .select({ user: 1, _id: 0 })
      .then((follows) => follows);

    // proccess array of identifications
    let followingClean = [];

    following.forEach((follow) => {
      followingClean.push(follow.followed);
    });

    let followersClean = [];

    followers.forEach((follow) => {
      followersClean.push(follow.user);
    });

    return {
      following: followingClean,
      followers: followersClean,
    };
  } catch (error) {
    return error
  }
};

const followThisUser = async (identifyUserId, profileUserId) => {
  // get info of following
  let following = await Follows.findOne({ "user": identifyUserId, "followed": profileUserId })
  let follower = await Follows.findOne({ "user": profileUserId, "followed": identifyUserId })

    return {
        following,
        follower
    }
   
}

module.exports = {
  followUserIds,
  followThisUser
};
