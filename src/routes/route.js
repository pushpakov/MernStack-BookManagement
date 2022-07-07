const express = require("express");
const router = express.Router();

const {userRegistration,
       userLogin
} = require('../controllers/userController')

const {createBookDocument,
<<<<<<< HEAD
       getBook,getBookById,
       updateBook} = require('../controllers/bookController') 
=======
       getBook,
       updateBook,deletedbook
       
} = require('../controllers/bookController') 
>>>>>>> f6fa823a09b86abb9a95577397b6cbf79070ae4b

const {Authentication,
       Authorisation
} = require('../middlewares/auth')

//This Are the APIs//

router.post("/register",  userRegistration)
<<<<<<< HEAD
router.post("/login", userLogin)
router.post("/books", Authentication,Authorisation, createBookDocument)
router.get("/books",Authentication, getBook)
router.get("/books/:bookId", Authentication, getBookById)
router.put("/books/:bookId", Authentication,Authorisation, updateBook)

=======
router.post("/books",  createBookDocument)
router.post("/login", userLogin)
router.put("/books/:bookId", Authenticate, updateBook)
router.get("/books",Authenticate, getBook)
router.delete("/books/:bookId",deletedbook)
//router.get("/books/:bookId", Authenticate, getBookById)
>>>>>>> f6fa823a09b86abb9a95577397b6cbf79070ae4b


module.exports = router;

