const express = require("express");
const router = express.Router();

const {userRegistration,
       userLogin
} = require('../controllers/userController')

const {createBookDocument,
       getBook,
       updateBook,
       
} = require('../controllers/bookController') 

const {Authenticate,
       Authorisation
} = require('../middlewares/auth')

//This Are the APIs//

router.post("/register",  userRegistration)
router.post("/books", Authenticate, createBookDocument)
router.post("/login", userLogin)
router.put("/books/:bookId",  updateBook)
router.get("/books",Authenticate, getBook)
//router.get("/books/:bookId", Authenticate, getBookById)


module.exports = router;

