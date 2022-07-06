const express = require("express");
const router = express.Router();
<<<<<<< HEAD
const userController=require("../controllers/userController")

router.post("/register",userController.userRegistration)
=======
const {userRegistration} = require('../controller/userController')
const {createBookDocument} = require('../controllers/bookController') 

route.post("/register", userRegistration)
route.post("/books", createBookDocument)
>>>>>>> a86918c16f35e8ad78da28b97fcae68623dcbd64


module.exports = router;
