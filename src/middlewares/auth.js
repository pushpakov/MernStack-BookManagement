const jwt = require('jsonwebtoken')
const bookModel = require('../models/bookModel')

let decodedToken

const Authenticate = async (req, res, next) => {
    try {
        let token = req.headers["x-api-key" || "X-Api-Key"]
        if (!token) return res.status(401).send({ status: false, msg: "No Token Found !!!" })

        decodedToken = jwt.verify(token, "Room 1")
        if (!decodedToken) {
            return res.status(401).send({ status: false, message: "Invalid Authentication !!!" })
        }
        return next()

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

const Authorisation = async (res, req, next) => {
    try {
        if (req.body.userId) {
            //Request Body
            if (decodedToken.userId != req.body.userId)
                return res.status(401).send({ status: false, msg: "Unauthorised !!!" });
        } else if (req.params.bookId) {
            //Path Parameter
            let requiredId = await bookModel.findOne({ _id: req.params.bookId }).select({ userId: 1, _id: 0 })
            let userIdFromBook = requiredId.userId.toString()
            if (decodedToken.userId != userIdFromBook)
                return res.status(401).send({ status: false, msg: "Unauthorised !!!" });
        }

        next()
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}


module.exports.Authenticate = Authenticate
module.exports.Authorisation = Authorisation