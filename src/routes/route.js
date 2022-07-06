const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController")

module.exports = router;


router.post("/books", bookController.createBookDocument);
router.get("/books", bookController.getBook);
