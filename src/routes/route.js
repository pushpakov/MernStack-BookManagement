const express = require("express");
const router = express.Router();
const {userRegistration} = require('../controller/userController')
const {createBookDocument} = require('../controllers/bookController') 

route.post("/register", userRegistration)
route.post("/books", createBookDocument)


module.exports = router;
