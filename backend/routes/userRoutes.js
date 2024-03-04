const router = require('express').Router()

const userController = require('../controllers/userController')

//middlewares
const verifyToken = require('../helpers/verify-token')
const { imageUpload } = require('../helpers/image-upload')

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/checkuser', userController.checkUser)
router.get('/:id', userController.getUserById)
router.patch('/edit/:id', verifyToken, imageUpload.single("image"),  userController.editUser)

module.exports = router