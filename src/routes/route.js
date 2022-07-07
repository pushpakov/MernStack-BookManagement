const express = require("express");
const router = express.Router();
const {userRegistration,
       userLogin
} = require('../controllers/userController')

const {createBookDocument, updateBook} = require('../controllers/bookController') 

//This Are the APIs//

router.post("/register", userRegistration)
router.post("/books", createBookDocument)
router.post("/login", userLogin)
router.put("/books/:bookId", updateBook)


module.exports = router;

