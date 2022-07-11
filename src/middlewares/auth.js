const jwt = require("jsonwebtoken");
const bookModel = require("../models/bookModel");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
let decodedToken;
let token;

const authentication = async (req, res, next) => {
  try {
    token = req.headers["x-api-key" || "X-Api-Key"];
    if (!token) {
      return res.status(401).send({ status: false, message: "No Token Found !!!" });
    }

    decodedToken = jwt.verify(token, "Room 1");

    if (!decodedToken) {
      return res
        .status(401)
        .send({ status: false, message: "Token is invalid !!!" });
    }
    req.loggedIn = decodedToken.userId
    next();
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const authorisation = async (req, res, next) => {
  try {

    decodedToken = jwt.verify(token, "Room 1");
    if(req.body.userId){
      //Request Body
      if(decodedToken.userId == req.body.userId) return next()
      else return res.status(401).send({ status: false, msg: "This UserId is Unauthorised!!!" });
   }else if(req.params.bookId){
      //Path Parameter
      let requiredId = await bookModel.findOne({_id: req.params.bookId}).select({userId:1, _id:0})
      let userIdFromBook = requiredId.userId.toString()
      if(decodedToken.userId == userIdFromBook) return next()
      else return res.status(401).send({ status: false, msg: " This UserId is Unauthorised!!!" });
     }
     req.loggedIn = decodedToken.userId
     return next()


    
    // let userId = req.body.userId;
    // let bookId = req.params.bookId;
    // let userIdFromBook;
    
    // if (bookId) {
    //   if (!ObjectId.isValid(bookId)) {
    //     return res
    //       .status(400)
    //       .send({ status: false, message: "Please Provide Valid Book ID" });
    //   }
    //   let user = await bookModel.findOne({ _id: bookId, isDeleted: false });
    //   if (!user) {
    //     return res
    //       .status(404)
    //       .send({ status: false, message: "No Book found" });
    //   }
    //   userIdFromBook = user.userId.toString();
    // } else {
    //    if(!userId || userId === 'undefined' || userId.trim().length===0){
    //   return res.status(400).send({status: false, message: 'Please enter userId'})
    //  }
    //   userIdFromBook = userId;
    // }
    // if (decodedToken.userId !== userIdFromBook) {
    //   return res.status(403).send({ status: false, message: "This User is Unauthorised to Create, Update and Delete a Book!!!" });
    // }
    // next();
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

module.exports.authentication = authentication;
module.exports.authorisation = authorisation;
