const express = require("express");
const router = express.Router();
const { userRegistration, userLogin } = require('../controllers/userController')
const { createBookDocument, getBook, getBookById, updateBook, deletedbook } = require('../controllers/bookController')
const { authentication, authorisation } = require('../middlewares/auth');
const { createReviewForBook } = require("../controllers/reviewController");

//These Are the APIs:-

router.post("/register", userRegistration)
router.post("/login", userLogin)
router.post("/books", authentication, authorisation, createBookDocument)
router.get("/books",authentication, getBook)
router.get("/books/:bookId", authentication, getBookById)
router.put("/books/:bookId", authentication, authorisation, updateBook)
router.delete("/books/:bookId", authentication, authorisation, deletedbook)
router.post("/books/:bookId/review", createReviewForBook)



module.exports = router;