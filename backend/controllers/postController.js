const Post = require('../models/post');
const fs = require('fs');
const path = require('path');
const User = require('../models/user');
const mongoosePaginate = require('mongoose-pagination');
const followService = require('../services/followServices');

const createPost = (req, res) => {
    let body = req.body;

    if(!body.text) return res.status(400).send({
        status: 'error',
        message: 'Invalid post, you must provide the text'
    })
    let post = new Post({
        user: req.user.id,
        text: body.text,
        file: body.file
    });
    post.save()
        .then((postDB)=>{
            if(!postDB) return res.status(400).send({
                status: 'error',
                message: 'Error saving post',
            })
            return res.status(200).send({
                status: 'success',
                post: postDB
            })
        })
}
const userPost = async(req, res) => {
  let userId = req.params.id;

  let page = 1;
  if(req.params.page) page = req.params.page;

  let itemPerPage = 3;

    Post.find({"user": userId})
        .populate('user', '-role -__v -email')
        .sort('-create_at')
        .paginate(page, itemPerPage)
        .then(async(postDB) => {
            let totalPost = await Post.countDocuments({'user': userId})
            if(!postDB) return res.status(404).send({
                status: 'error',
                message: 'Error getting post',
            })
            if(postDB.length <= 0) return res.status(200).send({message: 'There is not post to show'})
            return res.status(200).send({
                status: 'success',
                totalPost,
                page,
                post: postDB,
                totalPages: Math.ceil(totalPost/itemPerPage)
                
            })
        })

}
const getPosts = (req, res) => {

    Post.find()
        .sort('-create_at')
        .then((postDB) => {
            if(!postDB) return res.status(404).send({status: 'error', message: 'Error getting posts'})
            return res.status(200).send({
                status: 'success',
                user: req.user,
                postDB
            })
        })
        .catch((error) => {
            return res.status(400).send({status: 'error', message: 'Error getting posts', error: error.message})
        })

}

const getOnePost = (req, res) => {
    let postId = req.params.id;

    Post.findById(postId)
        .then((postDB) => {
            if(!postDB) return res.status(404).send({status: 'error', message: 'this post is not exist'})
            return res.status(200).send({
                status: 'success',
                post: postDB
            })
        })
}

const removeOnePost = (req, res) => {
    var postId = req.params.id;
    
    Post.findOneAndDelete({"user": req.user.id, "_id": postId})
        .then((postDB) => {
            if(!postDB) return res.status(404).send({
                status: 'error', 
                message: 'this post is not exist',
            })
            return res.status(200).send({
                status: 'success',
                message: 'this post has been removed',
                user: req.user,
                postDB
            })
        })
        .catch((error) => {
            return res.status(500).send({
                status: 'error',
                message: error.message
            });
        })
}

const updatePost = (req, res) => {
    let postId = req.params.id;

    let postUpdated = req.body;
     Post.findOneAndUpdate({_id: postId}, postUpdated, {new: true})
        .then((postDB) => {
            if(!postDB) return res.status(404).send({status: 'error', message: 'this post is not exist'})
            return res.status(200).send({
                status: 'success',
                message: 'this post has been updated',
                user: req.user.id,
                postDB
            })
        })
        .catch((error) => {
            return res.status(500).send({
                status: 'error',
                message: 'error updating this post',
                error: error.message
            })
        })
}
const uploadImage = (req, res) => {
    let postId = req.params.id;

    if(!req.file) return res.status(400).send({
        status: 'error',
        message: 'requested invalid'
    })

    let fileName = req.file.originalname;
    let fileSplit = fileName.split("\.");
    let fileExt = fileSplit[1];
    if(fileExt != "jpg" && fileExt != "png" && fileExt != "jpeg" && fileExt != "gif"){
        fs.unlink(req.file.path, (error) => {
            return res.status(400).send({
                status: 'error',
                messageL: 'The file is not valid'
            })
        })

    } else {
        Post.findOneAndUpdate({'user': req.user.id, "_id": postId}, {file: req.file.filename}, {new:true})
            .then((postDB) => {
                if(!postDB) return res.status(404).send({
                    status: 'error', 
                    message: 'this post is not exist'
                });
                return res.status(200).send({
                    status: 'success',
                    file: req.file,
                    post: postDB
                })
            })
            .catch((error) => {
                return res.status(500).send({
                    status: 'error',
                    message: error.message
                })
            })
    }
}

const media = (req, res) => {
     // get file
     let file = req.params.file;

     // get pth from the file
     const filePath = "./uploads/posts/"+file;
 
     // check if the file exist
     fs.stat(filePath, (error, exist) => {
         if(!exist || error) {
             return res.status(404).send({
                 status: 'error',
                 message: 'File does not exist'
             });
         } 
          return res.sendFile(path.resolve(filePath));
          
         
     })
    
}

const feed = async(req, res) => {
    // get paginate 
    let page = 1;
    if(req.params.page) {
        page = req.params.page
    }
    // set number of elements by page

    let itemPerPage = 5;
    // get an array of indetity that i follow
        const myFollows = await followService.followUserIds(req.user.id)
        Post.find({user: myFollows.following})
            .populate('user', '-role -__v -email')
            .sort("-create_at")
            .paginate(page, itemPerPage)
            .then(async(postDB) => {
                let totalPost = await Post.countDocuments({user: myFollows.following})
                if(!postDB) return res.status(404).send({
                    status: 'error',
                    message: 'User not found'
                })
                return res.status(200).send({
                    status: 'success',
                    message: 'Feed posted',
                    following: myFollows.following,
                    totalPost,
                    page,
                    itemPerPage,
                    pages: Math.ceil(totalPost/itemPerPage),
                    postDB
                })
            })
            .catch((error) => {
                return res.status(500).send({
                    status: 'error',
                    message: error.message
                })
            })


    
    // find a post "in", order and populate
    
}
module.exports = {
    createPost,
    getPosts,
    userPost,
    getOnePost,
    removeOnePost,
    updatePost,
    uploadImage,
    media,
    feed
}