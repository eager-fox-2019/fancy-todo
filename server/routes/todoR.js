const router = require('express').Router()
const todoC = require('../controllers/todoC')
const { authenticate, authorization } = require('../middleware/auth')

router.use('/',authenticate)

router.get('/findAll',todoC.allTodo)
router.get('/findOne/:id',todoC.detail)
router.post('/add',authorization,todoC.create)
router.patch('/update/:taskId',authorization,todoC.update)
router.delete('/remove/:taskId',authorization,todoC.remove)

router.get('/*',(req,res)=> {
    console.log ('Success')
    res.status(200).json({message:'Success Todo routes:)'})
})

module.exports = router