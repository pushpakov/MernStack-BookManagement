const express = require("express");
const router = express.Router();

const {userRegistration,
       userLogin
} = require('../controllers/userController')

const {createBookDocument,
       getBook,getBookById,
       updateBook} = require('../controllers/bookController') 

const {Authenticate} = require('../middlewares/auth')

//This Are the APIs//

router.post("/register",  userRegistration)
router.post("/books", Authenticate, createBookDocument)
router.post("/login", userLogin)
router.put("/books/:bookId", Authenticate, updateBook)
router.get("/books",Authenticate, getBook)
router.get("/books/:bookId", Authenticate, getBookById)


module.exports = router;

