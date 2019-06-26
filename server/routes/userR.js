const router = require('express').Router()
const userC = require('../controllers/userC')

router.post('/register',userC.register)
router.post('/login',userC.login)
router.post('/login/google',userC.googleLogin)

router.get('/*',(req,res)=> {
    console.log ('Success')
    res.status(200).json({message:'Success User Routes :)'})
})

module.exports = router