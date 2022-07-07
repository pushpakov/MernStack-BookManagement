const express = require("express");
const router = express.Router();
const {userRegistration,userLogin} = require('../controllers/userController')
const {createBookDocument,getBook,getBookById} = require('../controllers/bookController') 

//This Are the APIs//

router.post("/register", userRegistration)
router.post("/login", userLogin)
router.post("/books", createBookDocument)
router.get("/books", getBook)
router.get("/books/:bookId", getBookById)



module.exports = router;

