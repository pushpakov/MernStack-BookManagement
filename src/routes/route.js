const express = require("express");
const router = express.Router();

//const {userRegistration} = require('../controller/userController')
const {createBookDocument} = require('../controllers/bookController')
const {getBook} = require('../controllers/bookController')
module.exports = router;



//router.post("/register", userRegistration)
router.post("/books", createBookDocument)
router.get("/books", getBook);
