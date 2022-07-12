const reviewModel = require("../models/reviewModel");
const mongoose = require("mongoose");
const bookModel = require("../models/bookModel");
const ObjectId = mongoose.Types.ObjectId;

/*############################################ CREATE REVIEWS FOR BOOK ##########################################################*/

const createReviewForBook = async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const reviewDetail = req.body;
    if (!ObjectId.isValid(bookId)) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide valid book id" });
    }
    const IsBookIdExists = await bookModel.findOne({
      _id: bookId,
      isDeleted: false,
    });
    if (!IsBookIdExists) {
      return res
        .status(400)
        .send({ status: false, message: "Given Book id does not exist" });
    } else {
      reviewDetail.bookId = bookId;
      const newReview = await reviewModel.create(reviewDetail);

      if (newReview.review) {
        const updateBookDetails = await bookModel.findOneAndUpdate(
          { _id: bookId },
          { $inc: { reviews: 1 } },
          { new: true }
        );
        return res
          .status(200)
          .send({ status: true, message: "Success", data: updateBookDetails });
      }
    }
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

/*############################################ UPDATE REVIEWS FOR BOOK ##########################################################*/

const updateReview = async (req, res) => {
  try {

    let { review, rating, reviewedBy } = req.body
    let { bookId, reviewId } = req.params

    if (!ObjectId.isValid(bookId)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter Valid Book Id." })
    }

    if (!ObjectId.isValid(reviewId)) {
      return res
        .status(400)
        .send({ status: false, message: "Enter Valid Review Id." })
    }

    if (Object.keys(req.body) == 0) {
      return res
        .status(400)
        .send({ status: false, message: "Requst Body Cannot be Empty" })
    }

    let book = await bookModel.findOne({ _id: bookId, isDeleted: false })
    if (!book) {
      return res
        .status(404)
        .send({ status: true, message: "Book Does Not Found !!!" })
    }



    let reviewExist = await reviewModel.findOne({ _id: reviewId, bookId: bookId, isDeleted: false })

    if (!reviewExist) {
      return res
        .status(404)
        .send({ status: true, message: "Review Does Not Found !!!" })
    }



    let updatedReview = {}
    if (review) updatedReview.review = review
    if (rating) updatedReview.rating = rating
    if (reviewedBy) updatedReview.reviewedBy = reviewedBy

    let result = await reviewModel.findByIdAndUpdate(
      { _id: reviewId },
      updatedReview,
      { returnDocument: 'after' }
    )

    book._doc.reviewsData = result

    res.status(200).send({ status: true, message: "Success", data: book })

  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
}

/*############################################ DELETE REVIEWS BY BOOK-ID AND REVIEW ID ##########################################################*/

const deleteReview = async (req, res) => {
  try {
    let bookId = req.params.bookId
    let reviewId = req.params.reviewId

    if (!ObjectId.isValid(bookId)) return res.status(400).send({ status: false, message: "Enter Valid Book Id." })
    if (!ObjectId.isValid(reviewId)) return res.status(400).send({ status: false, message: "Enter Valid Review Id." })

    let book = await bookModel.findOne({ _id: bookId, isDeleted: false })

    if (!book) return res.status(404).send({ status: true, message: "Book Does Not Found !!!" })
    let reviews = book.reviews
    console.log(reviews)
    book = book._id.toString()

    let review = await reviewModel.findOneAndUpdate(
      { _id: reviewId, bookId: bookId, isDeleted: false },
      { $set: { isDeleted: true } }
    )

    if (!review) return res.status(404).send({ status: true, message: "Review Does Not Found !!!" })

    await bookModel.findOneAndUpdate(
      { _id: bookId },
      { reviews: reviews - 1 }
    )
    res.status(200).send({ status: true, message: "Review Deleted !!!" })


  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
}

module.exports.createReviewForBook = createReviewForBook;
module.exports.updateReview = updateReview;
module.exports.deleteReview = deleteReview;
