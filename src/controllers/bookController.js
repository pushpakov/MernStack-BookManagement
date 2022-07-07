// ### GET /books
// - Returns all books in the collection that aren't deleted.
//Return only book _id, title, excerpt, userId, category, releasedAt, reviews field. Response example [here](#get-books-response)
// - Return the HTTP status 200 if any documents are found. The response structure should be like [this](#successful-response-structure)
// - If no documents are found then return an HTTP status 404 with a response like [this](#error-response-structure)
// - Filter books list by applying filters. Query param can have any combination of below filters.
//   - By userId
//   - By category
//   - By subcategory
//   example of a query url: books?filtername=filtervalue&f2=fv2
// - Return all books sorted by book name in Alphabatical order

/*### POST /books
- Create a book document from request body. Get userId in request body only.
- Make sure the userId is a valid userId by checking the user exist in the users collection.
- Return HTTP status 201 on a succesful book creation. Also return the book document. The response should be a JSON object like [this](#successful-response-structure) 
- Create atleast 10 books for each user
- Return HTTP status 400 for an invalid request with a response body like [this](#error-response-structure)
*/

const bookModel = require('../models/bookModel')
const userModel = require('../models/userModel')
const ObjectId = require('mongoose').Types.ObjectId
const moment = require('moment')


let createBookDocument = async (req, res) => {
    try {
        let data = req.body

        let {
            title,
            excerpt,
            userId,
            ISBN,
            category,
            subcategory,
            
        }
            = data

        let releasedAt = moment().format('YYYY-MM-DD')
        console.log(releasedAt)
        
        let obj = {}

        obj.title = data.title.trim().split(" ").filter(word=>word).join(" ")
        obj.excerpt = data.excerpt.trim().split(" ").filter(word=>word).join(" ")
        obj.category = data.category.trim().split(" ").filter(word=>word).join(" ")
        obj.subcategory = data.subcategory
        obj.userId = data.userId
        obj.ISBN = data.ISBN.trim().split(" ").filter(word=>word).join("")
        obj.reviews = data.reviews
        obj.deletedAt = data.deletedAt ? Date.now():null
        obj.isDeleted = data.isDeleted
        obj.releasedAt = releasedAt
        

        
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "Please provide necessary Book Details" })
        }

        if (!title) {
            return res.status(400).send({ status: false, msg: "Title is required" })
        }

        if (!excerpt) {
            return res.status(400).send({ status: false, msg: "Excerts is required" })
        }

        if (!userId) {
            return res.status(400).send({ status: false, msg: "User Id is required" })
        }

        if(!ObjectId.isValid(userId)){
            return res.status(400).send({ status: false, msg: "User Id is Invalid" })
        }

        if (!category) {
            return res.status(400).send({ status: false, msg: "Category is required" })
        }

        if (!ISBN) {
            return res.status(400).send({ status: false, msg: "ISBN is required" })
        }

        if (!subcategory) {
            return res.status(400).send({ status: false, msg: "Subcategory is required" })
        }

        if (!releasedAt) {
            return res.status(400).send({ status: false, msg: "releasedAt is required" })
        }

        const titleExist = await bookModel.findOne({ title: obj.title })

        if (titleExist) {
            return res.status(409).send({ status: false, msg: "Title already exits" })
        }

        const isbnExist = await bookModel.findOne({ ISBN: obj.ISBN })

        if (isbnExist) {
            return res.status(409).send({ status: false, msg: "ISBN already exits" })
        }


        let validId = await userModel.findById(userId)
        if (!validId) {
            return res.status(400).send({ status: false, msg: 'userId is not Valid Id' })
        }

        let savedData = await bookModel.create(data)
        return res.status(201).send({ status: true, data: savedData })

    }
    catch(err) {
        console.log(err)
        return res.status(500).send({ status: false, msg: err.message })

    }
}


const getBook = async (req, res) => {
  try {
    const detailFromQuery = req.query;
    console.log(detailFromQuery)
    console.log(typeof detailFromQuery.category)
    // if (Object.keys(detailFromQuery).length === 0) {
    //   res.status(400).send({ status: false, msg: "Please Enter filter" });
    //   return;
    // }
    let loggedIn = req.loggedIn
    //  if(!detailFromQuery.userId.trim()){
    //      res.status(400).send({ status: false, msg: "Please Enter user id" });
    //    return;
    //  }
    // if(detailFromQuery.category.trim().length === 0){
    //     res.status(400).send({ status: false, msg: "Please Enter category" });
    //   return;
    // }
    // if(!detailFromQuery.subcategory.trim()){
    //     res.status(400).send({ status: false, msg: "Please Enter subcategory" });
    //   return;
    // }
    let filter = {
      isDeleted: false, userId : loggedIn
    };
    if (detailFromQuery.userId) {
      filter.userId = detailFromQuery.userId.trim();
    }
    if (detailFromQuery.category) {
      filter.category = detailFromQuery.category.trim();
    }
    if (detailFromQuery.subcategory) {
      filter.subcategory = detailFromQuery.subcategory.trim();
    }

    const books = await bookModel
      .find(filter)
      .sort({ title: 1 })
      .select({ ISBN: 0, subcategory: 0, deletedAt: 0, isDeleted: 0 });
    if (books.length === 0) {
      res.status(404).send({ status: false, msg: "No book found" });
      return;
    }
    res.status(200).send({ status: true, message: "Success", data: books });
    return;
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
    return;
  }
};

const getBookById = async (req , res) => {
  try{

    let result = await bookModel.findOne({_id : req.params.bookId})
    return res.status(201).send({status : true, data : result})
  }catch(err){
    res.status(500).send({ status: false, msg: err.message });
    return;
  }
}

module.exports.createBookDocument = createBookDocument;
module.exports.getBook = getBook;
module.exports.getBookById = getBookById;