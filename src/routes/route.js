const express = require("express");
const router = express.Router();

const {userRegistration} = require('../controllers/userController')
const {createBookDocument} = require('../controllers/bookController')
const {getBook} = require('../controllers/bookController')

router.post("/register", userRegistration)
router.post("/books", createBookDocument)
router.get("/books", getBook);

module.exports = router; 