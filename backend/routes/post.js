const express = require('express');
const router = express.Router();
const PostController = require('../controllers/postController');
const verifyToken = require('../middlewares/auth')
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/posts/")
    },
    filename: (req, file, cb) => {
        cb(null, "post-"+Date.now()+"-"+file.originalname);
    }
})
const uploads = multer({storage})


router.post('/createPost', verifyToken.auth, PostController.createPost);
router.get('/posts', verifyToken.auth, PostController.getPosts);
router.get('/getOnePost/:id', verifyToken.auth, PostController.getOnePost);
router.get('/userPost/:id/:page?', verifyToken.auth, PostController.userPost)
router.delete('/removeOnePost/:id', verifyToken.auth, PostController.removeOnePost);
router.put('/updatePost/:id', verifyToken.auth, PostController.updatePost);
router.post("/upload/:id", [verifyToken.auth, uploads.single("file0")], PostController.uploadImage)
router.get("/feed/:page?", verifyToken.auth, PostController.feed)
router.get("/media/:file", PostController.media)




module.exports = router