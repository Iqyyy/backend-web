const express = require('express')
const router = express.Router()
const controller = require('../controller/controller')
const Auth = require('../middleware/auth')

router.post('/register', controller.register)

router.post('/login', controller.login)

router.post('/profile', Auth.verifyToken, controller.profile)

router.post('/addcart', Auth.verifyToken, controller.addcart)

router.post('/logout', Auth.verifyToken, controller.logout)

router.post('/verify', Auth.verifyToken, controller.verify)

module.exports = router