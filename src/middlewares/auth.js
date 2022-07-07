const jwt = require('jsonwebtoken')
const bookModel = require('../models/bookModel')

let decodedToken

const Authenticate = async (req, res, next) => {
    try {
        let token = req.headers["x-api-key" || "X-Api-Key"]
        if (!token) {
            return res.status(401).send({ error: "No token found" })
        }
        decodedToken = jwt.verify(token, "Room 1")
        if (!decodedToken) {
            return res.status(401).send({ error: "Invalid token" })
        }
        next();
    
    }
    catch(err){
        return res.status(500).send({status : false, msg: err.message})
    }
}

module.exports.Authenticate = Authenticate