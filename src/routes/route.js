const express = require("express");
const router = express.Router();

const {userRegistration,
       userLogin
} = require('../controllers/userController')

const {createBookDocument,
       getBook,
       updateBook,
       deletedbook,
       getBookById
} = require('../controllers/bookController') 

const {Authentication,
       Authorisation
} = require('../middlewares/auth')

//Theses Are the APIs//

router.post("/register",  userRegistration)
router.post("/books", Authentication, Authorisation, createBookDocument)
router.post("/login", userLogin)
router.get("/books",Authentication, getBook)
router.get("/books/:bookId", Authentication, Authorisation, getBookById)
router.put("/books/:bookId", Authentication,Authorisation, updateBook)
router.delete("/books/:bookId", Authentication, Authorisation, deletedbook)



module.exports = router;