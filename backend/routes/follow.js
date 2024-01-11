const express = require('express');
const router = express.Router();
const FolllowController = require('../controllers/followController');
const verifyToken = require('../middlewares/auth')

router.post('/save', verifyToken.auth, FolllowController.createFollow)
router.delete('/unfollow/:id', verifyToken.auth, FolllowController.removeFollow)
router.get('/following/:id?/:page?', verifyToken.auth, FolllowController.following)
router.get('/followers/:id?/:page?', verifyToken.auth, FolllowController.followers)




module.exports = router