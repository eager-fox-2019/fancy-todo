const router = require('express').Router()
const userR = require('./userR')
const todoR = require('./todoR')

router.use('/users',userR)
router.use('/todos',todoR)

router.use('/*',(req,res)=> {
    console.log ("Now in router/index.js")
    res.status(404).json({message : 'Not Found :('})
})
module.exports = router