const express = require("express");
const router = express.Router();

const {userRegistration,userLogin} = require('../controllers/userController')

const {createBookDocument,getBook,getBookById,updateBook,deletedbook} = require('../controllers/bookController') 

const {Authentication,Authorisation} = require('../middlewares/auth')

//This Are the APIs//

router.post("/register",  userRegistration)
router.post("/login", userLogin)
router.post("/books", Authentication,Authorisation, createBookDocument)
router.get("/books",Authentication, getBook)
router.get("/books/:bookId", Authentication, getBookById)
router.put("/books/:bookId", Authentication,Authorisation, updateBook)
router.delete("/books/:bookId",Authentication,Authorisation, deletedbook)


module.exports = router;

