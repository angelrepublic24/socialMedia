const Follows = require('../models/follows');
const User = require('../models/user');
const mongoosePaginate = require('mongoose-pagination');

// Services
const followServices = require('../services/followServices');

const createFollow = (req, res) => {
    let body = req.body;
    let identity = req.user;

    let userToFollow = new Follows({
        user: identity.id,
        followed: body.followed, 
    });

    
    userToFollow.save()
                .then((userFollowed) => {
                    if(!userFollowed) return res.status(400).send({
                        status: 'error',
                        message: 'User could not be followed'
                    })
                    res.status(200).send({
                        status: 'success',
                        message: 'Follows created successfully',
                        identity: req.user,
                        userToFollow
                
                    })
                })
                .catch((error) => {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Somthing is wrong',
                        error: error.message

                    })
                })


   
}

const removeFollow = (req, res) => {
    let user_id = req.user.id;

    let userFollowed = req.params.id;

    Follows.find({"user": user_id,"followed": userFollowed})
            .deleteOne()
            .then((userDelete) => {
                if(!userDelete) return res.status(400).send({
                    status: 'error',
                    message: 'The user is not following this user'
                })
                return res.status(200).send({
                    status: 'success',
                    userDelete,
                    user: req.user
                })
            })
            .catch((error) => {
                return res.status(500).send({
                    status: 'error',
                    error,
                    message: error.message
                })
            })

}

const following = (req, res) => {
    // get id of user identified
    let userId = req.user.id;
    //check if i'm getting the id by url
    let params = req.params.id
    if(params) userId = params
    // check if i get the page
    let page = 1;
    if(req.params.page){
        page = parseInt(req.params.page);
    }

    // user per pagination
    let itemsPerPage = 5
    // find a follow and get the ddata and paginate it
    Follows.find({user: userId})
            .populate("user followed", "-role -__v -email")
            .paginate(page, itemsPerPage)
            .then(async(follows) =>{
                // array de ids de usuarios que me siguen y que yo sigo
                let totalFollows =  await Follows.countDocuments({})
                if(!follows) return res.status(400).send({
                    status: 'error',
                    message: 'No follows avaliable'
                })

                let followUserIds = await followServices.followUserIds(req.user.id)
                return res.status(200).send({
                    status: 'success',
                    message: 'List of the users that i am following',
                    follows,
                    page,
                    itemsPerPage,
                    totalFollows,
                    totalPage: Math.ceil(totalFollows / itemsPerPage),
                    user_following: followUserIds.following,
                    user_follow_me: followUserIds.followers
                 })
            })
            .catch((error) => {
                return res.status(500).send({
                    status: 'Error',
                    error,
                    message: 'Query error...'
                })
            })

     
}

const followers = (req, res) => {
    // get id of user identified
    let userId = req.user.id;
    //check if i'm getting the id by url
    let params = req.params.id
    if(params) userId = params
    // check if i get the page
    let page = 1;
    if(req.params.page) page = parseInt(req.params.page);
     // user per pagination
     let itemsPerPage = 5
     // find a follow and get the ddata and paginate it
     Follows.find({followed: userId})
             .populate("user followed", "-role -__v -email")
             .paginate(page, itemsPerPage)
             .then(async(follows) =>{
                 // array de ids de usuarios que me siguen y que yo sigo
                 let totalFollows =  await Follows.countDocuments({})
                 if(!follows) return res.status(400).send({
                     status: 'error',
                     message: 'No follows avaliable'
                 })
 
                 let followUserIds = await followServices.followUserIds(req.user.id)
                 return res.status(200).send({
                     status: 'success',
                     message: 'List of the users that ',
                     follows,
                     page,
                     itemsPerPage,
                     totalFollows,
                     totalPage: Math.ceil(totalFollows / itemsPerPage),
                     user_following: followUserIds.following,
                     user_follow_me: followUserIds.followers
                  })
             })
    
}
module.exports = {
    createFollow,
    removeFollow,
    following,
    followers
}