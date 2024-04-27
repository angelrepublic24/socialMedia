const User = require('../models/user');
const Follow = require('../models/follows');
const Post = require('../models/post');
const bcrypt = require('bcrypt');
const fs = require('fs');
const jwt = require('../services/jwt');
const path = require('path');
const validate = require('../helpers/validate');
const followServices = require('../services/followServices');

 const test = (req, res) => {
    return res.status(200).send({message: 'Test successful'})
 }

 const register = async(req, res) => {
    // recoger datos
    let body = req.body;

    // comprobar que lleguen bien los datos
    if(!body.name || !body.surname || !body.email || !body.password) {
        return res.status(400).json({
            status: 'error',
            message: 'Missing data',
        });
    }

    validate(body)

    // Control de usuarios duplicados

    try{
        let existingUser = await User.find({
            $or: [
                {email: body.email.toLowerCase()},
            ]
        }).exec();
        if(existingUser && existingUser.length >=1) {
            return res.status(200).json({
                status: 'success',
                message: 'User already exists'
            })
        }else {
            let password = await bcrypt.hash(body.password, 10);
            body.password = password;

            let user = new User(body);

            user.save()
                .then((userDB) => {
                    if(!userDB) return res.status(400).json({
                        status: 'error',
                        message: 'Error creating user'
                    })
                    return res.status(200).json({
                        status: 'success',
                        message: 'User created',
                        user: userDB
                    })
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }
    catch(err) {
        return res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        })

    }

 }
 const login = (req, res) => {
    // recoger body
    let body = req.body;

    User.findOne({email: body.email})
        .then((userDB) => {
            if(!userDB) return res.status(400).json({
                status: 'error',
                message: "(Email) or password incorrect"
            })

            if(!bcrypt.compareSync(body.password, userDB.password)){
                return res.status(400).json({
                    status: 'error',
                    message: 'Email or (password) incorrect'
                })
            }
            // get token
            const token = jwt.createToken(userDB)
            return res.status(200).json({
                status: 'success',
                message: "Accion login",
                userDB,
                token
            })
        })




 }

 const profile = (req, res) => {
    // get parameter of the id of the user by the url
    let id = req.params.id;
    // consult to get data from user
    User.findById(id)
        .select({role: 0})
        .then(async(userProfile) => {
            if(!userProfile) {
                return res.status(404).send({
                    status: 'error',
                    message: 'The user does not exist'
                })
            }
            // info of follows
            let followInfo = await followServices.followThisUser(req.user.id, id)
            console.log(req.user.id)
                // return result
            return res.status(200).json({
                status: 'success',
                user: userProfile,
                following: followInfo.following,
                followers: followInfo.follower
            })
        })
        .catch((error) => {
            console.log(error)
        })
 }

 const listUser = (req, res) => {
    // controlar en que pagina estamos
    let page = 1;
    if(req.params.page){
        page = parseInt(req.params.page);
    }
    // consulta con mongoose paginate
    let itemPerPage = 5;
    // devolver resultado
    User.find()
        .sort('_id')
        .select('-email -role -__v')
        .paginate(page, itemPerPage)
        .then(async(userPage) => {
            let totalUsers = await User.countDocuments({}).exec();
            if(!userPage){
                return res.status(404).json({
                    status: "error",
                    message: "User not found"
                })
            }
            let followUserIds = await followServices.followUserIds(req.user.id)
            return res.status(200).json({
                status: 'success',
                message: "List of user",
                users: userPage,
                page,
                itemPerPage,
                total: totalUsers,
                pages: Math.ceil(totalUsers/itemPerPage),
                user_following: followUserIds.following,
                user_follow_me: followUserIds.followers
            })
        })
        .catch((err) => {
            return res.status(500).json({
                status: "Error",
                message: 'Error: ' + err.message,
                err
            })
        })
 }

 const update = (req, res) => {
    // get dara from user
    let userToIndentity = req.user;
    let userToUpdate = req.body;
    // check if user is already created
    User.find({
        $or: [
            {email: userToUpdate.email},
        ]
        })
        .then(async(users) =>{
            let userIsSet = false;
            users.forEach(user => {
                if(user && user._id != userToIndentity.id){
                    userIsSet = true;
                }
            })
             if(userIsSet){
                return res.status(200).json({
                    status: 'success',
                    message: 'User already exists'
                })
            }

            if(userToUpdate.password){
                let password =  await bcrypt.hash(userToUpdate.password, 10);
                userToUpdate.password = password;
            }else{
                userToUpdate.password = userToIndentity.password;
            }

             // search and update
             User.findByIdAndUpdate(userToIndentity.id, userToUpdate, {new: true})
                .then((userUpdate) => {
                    if(!userUpdate) return res.status(404).send({
                        status: 'error',
                        message: 'User not found to update'
                    })

                    return res.status(200).json({
                        status: 'success',
                        message: 'Updated successfully',
                        user: userToUpdate
                    })
            
                })
                .catch((error) => {
                    if(error) return res.status(500).json({
                        status: 'Error', 
                        message: 'Error to update user',
                        error: error.message
                    })
                })
        })
        .catch((error) =>{
            if(error) return res.status(500).json({status: 'Error', message: 'Error: ' + error.message});

        })
       
   

 }
 const upload = (req, res) => {

    // recoger fichero de imagen y comprobar que existe
    let file = req.file
    if(!file) return res.status(404).json({status: 'error', message: "requested invalid"})

    // get file's name
    let fileName = file.originalname
    let fileSplit = fileName.split("\.")
    let fileExt = fileSplit[1]

    if(fileExt != "png" && fileExt != "jpg" && fileExt != "jpeg" && fileExt != "gif"){
        let filePath = req.file.path;
        let fileDeleted = fs.unlinkSync(filePath);
        return res.status(400).json({
            status: 'error',
            message: 'The extension is not valid'
        })
    }
    User.findOneAndUpdate({_id: req.user.id}, {avatar: req.file.filename}, {new: true})
        .then((userDB) => {
            if(!userDB) return res.status(400).send({
                status: 'error',
                message: 'The user not exist'
            })

            return res.status(200).json({
                status: 'success',
                user: userDB,
                file: req.file,
                
            })
        })
        .catch((error) => {
            return res.status(500).send({
                status: 'Error',
                message: error.message  
            })
        })
    
 }

 const getAvatar = (req, res) => {
    // get file
    let file = req.params.file;

    // get pth from the file
    const filePath = "./uploads/avatar/"+file;

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

 const counter = async(req, res) => {
    let userId = req.user.id;

    if(req.params.id){
        userId = req.params.id;
    }

    try {
        const following = await Follow.count ({'user': userId});
        const followed = await Follow.count({'followed': userId});
        const posts = await Post.count({'user': userId});

        return res.status(200).send({
            userId,
            following,
            followed,
            posts
        })
    } catch (error) {
        return res.status(500).send({
            status: 'error',
            message: error.message
        })
    }
 }

 module.exports = {
    test,
    register,
    login,
    profile,
    listUser,
    update,
    upload,
    getAvatar,
    counter
 }