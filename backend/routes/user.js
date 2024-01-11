const express = require('express');
const multer = require('multer');
const router = express.Router();
const UserController = require('../controllers/userController');
const verifyToken = require('../middlewares/auth')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/avatar/")
    },
    filename: (req, file, cb) => {
        cb(null, "avatar-"+Date.now()+"-"+file.originalname);
    }
})
const uploads = multer({storage})

router.get('/test', verifyToken.auth, UserController.test);
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get("/profile/:id", verifyToken.auth, UserController.profile);
router.get("/listUser/:page?", verifyToken.auth, UserController.listUser);
router.put("/update", verifyToken.auth, UserController.update);
router.post("/upload", [verifyToken.auth, uploads.single("file0")], UserController.upload)
router.get("/avatar/:file", UserController.getAvatar)
router.get("/counter/:id", verifyToken.auth, UserController.counter)






module.exports = router