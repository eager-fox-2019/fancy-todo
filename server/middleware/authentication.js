const jwt = require('jsonwebtoken')
const Project = require('../models/Project')

function Authenticate(req, res, next) {
    try {
        if (req.headers.hasOwnProperty('token')) {
            const decode = jwt.verify(req.headers.token, process.env.JWT_SECRET)
            req.loggedUser = decode
            next()
        } else {
            throw ({
                code: 401,
                message: "you have to login first"
            })
        }
    } catch (error) {
        next(error)
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