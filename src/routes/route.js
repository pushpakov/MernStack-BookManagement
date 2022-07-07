const express = require("express");
const router = express.Router();

const {userRegistration,
       userLogin
} = require('../controllers/userController')

const {createBookDocument,
       getBook,
       updateBook,deletedbook
       
} = require('../controllers/bookController') 

const {Authenticate,
       Authorisation
} = require('../middlewares/auth')

//This Are the APIs//

router.post("/register",  userRegistration)
router.post("/books",  createBookDocument)
router.post("/login", userLogin)
router.put("/books/:bookId", Authenticate, updateBook)
router.get("/books",Authenticate, getBook)
router.delete("/books/:bookId",deletedbook)
//router.get("/books/:bookId", Authenticate, getBookById)


module.exports = router;

