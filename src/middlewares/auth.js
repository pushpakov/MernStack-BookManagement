const jwt = require('jsonwebtoken')
const bookModel = require('../models/bookModel')

let decodedToken;

const authentication = async (req, res, next) => {
    try {
        let token = req.headers["x-api-key" || "X-Api-Key"]
        if (!token) {
            return res.status(401).send({ status: false, msg: "No Token Found !!!" })
        }

        decodedToken = jwt.verify(token, "Room 1")

        // if (!decodedToken) {
        //     return res.status(401).send({ status: false, message: "Token is invalid !!!" })
        // }

        next()

    } catch (err) {
        return res.status(401).send({ status: false, message: err.message })
    }
}

const authorisation = async (req, res, next) => {
    try {
        let token = req.headers["x-api-key" || "X-Api-Key"]
        decodedToken = jwt.verify(token, "Room 1")
        let userId = req.body.userId;
        let bookId = req.params.bookId;
        let userIdFromBook;
        if (bookId) {
            let user = await bookModel.findOne({ _id: req.params.bookId }).select({ userId: 1, _id: 0 })
            if (!user) {
                return res.status(404).send({ status: false, message: 'No Book found' })
            }
            userIdFromBook = user.userId.toString()
        } else {
            userIdFromBook = userId
        }
        if (decodedToken.userId !== userIdFromBook) {
            return res.status(401).send({ status: false, msg: "Unauthorised!!!" });
        }

        next()
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}


module.exports.authentication = authentication
module.exports.authorisation = authorisation