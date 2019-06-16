const router = require('express').Router()
const todoC = require('../controllers/todoC')
const { authenticate } = require('../middleware/auth')

router.use('/',authenticate)

router.get('/findAll',todoC.allTodo)
router.get('/findOne/:id',todoC.detail)
router.post('/add',todoC.create)
router.patch('/update/:taskId',todoC.update)
router.delete('/remove/:taskId',todoC.remove)

router.get('/*',(req,res)=> {
    console.log ('Success')
    res.status(200).json({message:'Success Todo routes:)'})
})

module.exports = router