const jwt = require('jsonwebtoken')
const Project = require('../models/Project')

function Authenticate(req, res, next) {
    if (req.headers.hasOwnProperty('token')) {
        try {
            const decode = jwt.verify(req.headers.token, process.env.JWT_SECRET)
            req.loggedUser = decode
            next()
        } catch (error) {
            next(error)
        }
    } else {
        res.status(401).json({
            msg: 'you have to login first'
        })
    }
}

async function AuthorizeRead(req, res, next) {
    try {
        let result = await Project.findById(req.params.projectId)
        if (result) {
            let isMember = (result.members.indexOf(req.loggedUser.id) !== -1)
            let isOwner = (result.owner == req.loggedUser.id)
            if (isMember || isOwner) {
                next()
            } else {
                throw ({
                    code: 400,
                    message: "not authorized"
                })
            }
        } else {
            throw ({
                code: 404,
                message: "project not found"
            })
        }
    } catch (error) {
        next(error)
    }
}

async function AuthorizeDelete(req, res, next) {
    try {
        let result = await Project.findById(req.params.projectId)
        if (result) {
            let isOwner = (result.owner == req.loggedUser.id)
            if (isOwner) {
                next()
            } else {
                throw ({
                    code: 400,
                    message: "not authorized"
                })
            }
        } else {
            throw ({
                code: 404,
                message: "project not found"
            })
        }
    } catch (error) {
        next(error)
    }
}

module.exports = {
    Authenticate,
    AuthorizeRead,
    AuthorizeDelete
}