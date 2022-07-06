const express = require('express')
const router = express.Router()  
const createUser = require("../controllers/userController")
const createBook = require('../controllers/bookController')




router.post("/register", createUser.userRegistration)
router.post("/books", createBook.createBookDocument)


module.exports = router;
