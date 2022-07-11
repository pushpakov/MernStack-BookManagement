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

const updateReviewForBook = async (req, res) => {
try{
  let bookId = req.params.bookId
  if (!ObjectId.isValid(bookId)) {
    return res.status(400).send({ status: false, msg: "Book Id is Invalid" });
  }

  let reviewId = req.params.reviewId
  if (!ObjectId.isValid(reviewId)) {
    return res.status(400).send({ status: false, msg: "Review Id is Invalid" });
  }

  let reviewDetail = req.body
  let {review, rating, reviewedBy} = reviewDetail
  
  let obj = {}
  
  
  obj.review = review
  obj.rating = rating
  obj.reviewedBy = reviewedBy

 
  let checkByBook = await bookModel.findOne({_id: bookId, isDeleted: false})
  if(!checkByBook){
    return res.status(404).send({ status: true, message: "Book Does Not Found !!!" })
  }

  obj.reviewsData = checkByBook.reviews


  let checkByBookId = checkByBook._id.toString()

  let updatedReviewDetail = await reviewModel.findOneAndUpdate(
    { _id: reviewId, bookId: checkByBookId, isDeleted: false },
    {checkByBook, obj},
    { returnDocument: "after" }
  )
  if(updatedReviewDetail == null) {
    return res.status(404).send({ status: true, message: "Update request denied, review is no more available" })
  }
  

  console.log(updatedReviewDetail)
  return res.status(200).send({ status: true, message: "Success", data: updatedReviewDetail })
}
catch(err){
  return res.status(500).send({ status: false, message: err.message })
}
}


/*############################################ DELETE REVIEWS FOR BOOK ##########################################################*/

const deleteReview = async (req, res) => {
  try {
    let bookId = req.params.bookId
    let reviewId = req.params.reviewId
    let book = await bookModel.findOne({ _id: bookId, isDeleted: false }).select({ _id: 1 })

    if (!book) return res.status(404).send({ status: true, message: "Book Does Not Found !!!" })
    book = book._id.toString()

    let review = await reviewModel.findOneAndUpdate(
      { _id: reviewId, bookId: bookId, isDeleted: false },
      { $set: { isDeleted: true } }
    )

    if (!review) return res.status(404).send({ status: true, message: "Review Does Not Found !!!" })

    res.status(200).send({ status: true, message: "Review Deleted !!!" })


  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
}




module.exports.createReviewForBook = createReviewForBook
module.exports.updateReviewForBook = updateReviewForBook
module.exports.deleteReview = deleteReview

