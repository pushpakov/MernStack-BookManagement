/*############################################ POST BOOKS ##########################################################*/

const bookModel = require('../models/bookModel')
const userModel = require('../models/userModel')
const reviewModel = require('../models/reviewModel')
const ObjectId = require('mongoose').Types.ObjectId
const isbn = require('isbn-validate')                     // to validate 10 digit isbn  
const { checksum } = require('isbn-validation')              // to validate 13 digit isbn

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};


let createBookDocument = async (req, res) => {
  try {
    let bookDeatils = req.body;
    let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = bookDeatils;
    let obj = {};

    if (Object.keys(bookDeatils).length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "Please Provide Necessary Book Details" });
    }

    if (!isValid(title)) {
      return res.status(400).send({ status: false, message: "Title is required" });
    }

    obj.title = title
      .trim()
      .split(" ")
      .filter((word) => word)
      .join(" ");

    if (!isValid(excerpt)) {
      return res
        .status(400)
        .send({ status: false, message: "Excerpt is required" });
    }
    obj.excerpt = excerpt
      .trim()
      .split(" ")
      .filter((word) => word)
      .join(" ");

    if (!userId) {
      return res
        .status(400)
        .send({ status: false, message: "User Id is required" });
    }

    if (!ObjectId.isValid(userId)) {
      return res.status(400).send({ status: false, message: "User Id is Invalid" });
    }
    obj.userId = userId;
    if (!isValid(category)) {
      return res
        .status(400)
        .send({ status: false, message: "Category is required" });
    }
    obj.category = category
      .trim()
      .split(" ")
      .filter((word) => word)
      .join(" ");

    if (!isValid(ISBN)) {
      return res.status(400).send({ status: false, message: "ISBN is required" });
    }
    // if(!isbn.Validate(ISBN) || !checksum(ISBN)){
    //     return res.status(400).send({status: false, message: "Please enter valid ISBN"})
    // }
    obj.ISBN = ISBN.trim()
      .split(" ")
      .filter((word) => word)
      .join("");
    if (!isValid(subcategory)) {
      return res
        .status(400)
        .send({ status: false, message: "Subcategory is required" });
    }
    obj.subcategory = subcategory;

    const titleExist = await bookModel.findOne({ title: obj.title });
    if (titleExist) {
      return res
        .status(409)
        .send({ status: false, message: "Title already exists" });
    }

    const isIsbnExist = await bookModel.findOne({ ISBN: obj.ISBN });
    if (isIsbnExist) {
      return res.status(409).send({ status: false, message: "ISBN already exists" });
    }

    if (!(/((\d{4}[\/-])(\d{2}[\/-])(\d{2}))/.test(releasedAt.trim()))) {
      return res
        .status(400)
        .send({ status: false, message: "Enter Date in YYYY-MM-DD format!!!" });
    }
    if (!isValid(releasedAt)) {
      return res
        .status(400)
        .send({ status: false, message: "releasedAt is required" });
    }
    obj.releasedAt = releasedAt;


    let validId = await userModel.findById(userId);
    if (!validId) {
      return res
        .status(400)
        .send({ status: false, message: "userId is not Valid Id" });
    }
    let savedData = await bookModel.create(obj);
    return res.status(201).send({ status: true, message: 'Success', data: savedData });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};


/*############################################ GET BOOK ##########################################################*/

const getBook = async (req, res) => {
  try {
    const {userId, category, subcategory} = req.query;
    let loggedIn = req.loggedIn
    let filter = {
      isDeleted: false, userId: loggedIn
    };
    if (userId) {
      if(!ObjectId.isValid(userId.trim())) return res.status(400).send({ status: false, message : "Enter Valid User Id!!"})
      filter._id = userId;
    }
    if (category) {
      filter.category = category.trim();
    }
    if (subcategory) {
      filter.subcategory = subcategory.trim();
    }

    const book = await bookModel
      .findOne(filter)
      .sort({ title: 1 })
      .select({ ISBN: 0, subcategory: 0, deletedAt: 0, isDeleted: 0 });

    if(!book) return res.status(404).send({ status: false, message: 'Book Does Not Found' })

    let reviews = await reviewModel.find({ bookId: book._id, isDeleted: false })
    if (book.reviews == 0) book._doc["reviewsData"] = [] ;
    else  book._doc["reviewsData"] = reviews;

    return res.status(200).send({ status: true, message: "Success", data: book });

  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};


const getBookById = async (req, res) => {
  try{
  const bookId = req.params.bookId;
  const filteredBookId = bookId
  const book = await bookModel.findById({ _id: filteredBookId, isDeleted : false });
  if (!book) {
    return res.status(404).send({ status: false, message: 'Book not found' })
  }

  let reviews = await reviewModel.find({ bookId: book._id, isDeleted: false })
  if (book.reviews === 0)  book._doc.reviewsData = [];
  else book._doc.reviewsData = reviews
  return res.status(200).send({ status: true, message: "Success", data: book })
  }
  catch(err){
    return res.status(500).send({ status: false, message: err.message });
  }
}



/*############################################ UPDATE BOOKS BY BOOK-ID ##########################################################*/


const updateBook = async (req, res) => {
  try {
    let bookId = req.params.bookId;

    if (!ObjectId.isValid(bookId)) {
      return res.status(400).send({ status: false, message: "Book Id is Invalid" });
    }

    let bookDetailToUpdate = req.body;
    if (Object.keys(bookDetailToUpdate).length === 0) {
      return res.status(400).send({ status: false, message: 'Please Provide Details for Update' })
    }

    let { title, excerpt, releasedAt, ISBN } = bookDetailToUpdate;

    let bookObject = {};
    if (Object.keys(bookDetailToUpdate).indexOf('title') !== -1) {
      if (title.trim().length === 0) {
        return res.status(400).send({ status: false, message: 'Please Enter title' })
      }
      let trimmedTitle = title
        .trim()
        .split(" ")
        .filter((word) => word)
        .join(" ");
      const isTitleExist = await bookModel.findOne({ title: trimmedTitle });
      if (isTitleExist) {
        return res
          .status(409)
          .send({ status: false, message: "Title already exists" });
      }
      bookObject.title = trimmedTitle;
    }
    if (Object.keys(bookDetailToUpdate).indexOf('excerpt') !== -1) {
      if (excerpt.length == 0) {
        return res.status(400).send({ status: false, message: 'Please Enter excerpt' })
      }
      bookObject.excerpt = excerpt
        .trim()
        .split(" ")
        .filter((word) => word)
        .join(" ");
    }
    if (Object.keys(bookDetailToUpdate).indexOf("ISBN") !== -1) {
      if (ISBN.length == 0) {
        return res.status(400).send({ status: false, message: 'Please Enter ISBN' })
      }
      let trimmedISBN = ISBN.trim()
        .split("-")
        .filter((word) => word)
        .join("");
      if (ISBN.length == 10) {
        if (!isbn.Validate(trimmedISBN)) {
          return res
            .status(400)
            .send({ status: false, message: "ISBN is Invalid" });
        }
      }
      if (ISBN.length == 13) {
        if (!checksum(trimmedISBN)) {
          return res
            .status(400)
            .send({ status: false, message: "ISBN is Invalid" });
        }
        const isIsbnExist = await bookModel.findOne({ ISBN: trimmedISBN });

        if (isIsbnExist) {
          return res.status(409).send({ status: false, message: "ISBN already exists" });
        }
        bookObject.ISBN = trimmedISBN;
      }
    }



    // if (!isbn.Validate(ISBN)) {
    //   if (!checksum(bookObject.ISBN)) {
    //     return res
    //       .status(400)
    //       .send({ status: false, message: "ISBN is Invalid" });
    //   }
    // }
    if (!(/((\d{4}[\/-])(\d{2}[\/-])(\d{2}))/.test(releasedAt.trim()))) {
      return res
        .status(400)
        .send({ status: false, message: "Enter Date in YYYY-MM-DD format!!!" });
    }
    bookObject.releasedAt = releasedAt;


    let book = await bookModel.findOne({ _id: bookId, isDeleted: false });
    if (!book) {
      return res
        .status(404)
        .send({
          status: false,
          message: 'Book not found',
        });
    }
    // if (book.isDeleted == true) {
    //   return res
    //     .status(404)
    //     .send({ status: false, message: "Document already deleted" });
    // }
    let updatedbookDetail = await bookModel.findOneAndUpdate(
      { _id: book._id },
      bookObject,
      { returnDocument: "after" }
    );

    return res
      .status(200)
      .send({ status: true, message: "Success", data: updatedbookDetail });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};


/*############################################ DELETE BY BOOK-ID ##########################################################*/

const deletedbook = async (req, res) => {
  try {

    let bookId = req.params.bookId

    if (!ObjectId.isValid(bookId)) {
      return res.status(400).send({ status: false, message: "Invalid Book Id." })
    }

    let findid = await bookModel.findOne({ _id: bookId, isDeleted: false })

    if (!findid) {
      return res.status(400).send({ status: false, message: "The Requested Book is Unavailable" })
    }

    let deletedData = await bookModel.findOneAndUpdate({ _id: bookId }, { $set: { isDeleted: true, deletedAt: Date.now() } })
    return res.status(200).send({ status: true, message: `${deletedData.title} Successfully Deleted.` })

  } catch (error) {
    res.status(500).send({ status: false, message: error })
  }
}






module.exports.createBookDocument = createBookDocument;
module.exports.getBook = getBook;
module.exports.getBookById = getBookById;
module.exports.updateBook = updateBook;
module.exports.deletedbook = deletedbook;