const express = require("express");
const router = express.Router();
const {userRegistration,
       userLogin
} = require('../controllers/userController')
const {createBookDocument} = require('../controllers/bookController') 



router.post("/register", userRegistration)
router.post("/books", createBookDocument)
router.post("/login", userLogin)



module.exports = router;
