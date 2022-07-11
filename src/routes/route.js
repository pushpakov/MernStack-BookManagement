const express = require("express");
const router = express.Router();
const { userRegistration, userLogin } = require('../controllers/userController')
const { createBookDocument, getBook, getBookById, updateBook, deletedbook } = require('../controllers/bookController')
const { authentication, authorisation } = require('../middlewares/auth');
<<<<<<< HEAD
const { createReviewForBook, updateReviewForBook, deleteReview } = require("../controllers/reviewController");
=======
const { createReviewForBook, updateReview, deleteReview } = require("../controllers/reviewController");
>>>>>>> 83e2e0517d2033d92f32a70f0a34b2585d707218

//These Are the APIs:-
//User API
router.post("/register", userRegistration)
router.post("/login", userLogin)

//Book APIs
router.post("/books", authentication, authorisation, createBookDocument)
router.get("/books",authentication, getBook)
router.get("/books/:bookId", authentication, getBookById)
router.put("/books/:bookId", authentication, authorisation, updateBook)
router.delete("/books/:bookId", authentication, authorisation, deletedbook)

//APIs of Review
router.post("/books/:bookId/review", createReviewForBook)
<<<<<<< HEAD
router.put("/books/:bookId/review/:reviewId", updateReviewForBook)
=======
router.put("/books/:bookId/review/:reviewId", updateReview)
>>>>>>> 83e2e0517d2033d92f32a70f0a34b2585d707218
router.delete("/books/:bookId/review/:reviewId", deleteReview)



module.exports = router;