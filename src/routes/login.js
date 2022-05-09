const {Router} = require('express')
const router = Router()
const loginController = require('../controllers/login.controller.js')

router.get('/',
    loginController.renderSignIn)
router.get('/registro',
    loginController.renderSignUp)

module.exports = router