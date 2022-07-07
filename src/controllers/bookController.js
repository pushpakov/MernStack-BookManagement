/*############################################ POST BOOKS ##########################################################*/

const bookModel = require('../models/bookModel')
const userModel = require('../models/userModel')
const ObjectId = require('mongoose').Types.ObjectId
const isbn = require("isbn-validate")


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
            releasedAt

        } = data
        
        let obj = {}

        obj.title = data.title.trim().split(" ").filter(word=>word).join(" ")
        obj.excerpt = data.excerpt.trim().split(" ").filter(word=>word).join(" ")
        obj.category = data.category.trim().split(" ").filter(word=>word).join(" ")
        obj.subcategory = data.subcategory
        obj.userId = data.userId
        obj.ISBN = data.ISBN.trim().split("-").filter(word=>word).join("")
        obj.reviews = data.reviews
        obj.deletedAt = data.deletedAt ? Date.now():null
        obj.isDeleted = data.isDeleted
        obj.releasedAt = data.releasedAt
        

        
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
        
        if (!isbn.Validate(ISBN)) {
            return res.status(400).send({ status: false, msg: "ISBN is Invalid" })
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

        let savedData = await bookModel.create(obj)
        return res.status(201).send({ status: true, data: savedData })

    }
    catch(err) {
        console.log(err)
        return res.status(500).send({ status: false, msg: err.message })

    }
}


/*############################################ GET BOOK ##########################################################*/

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



/*############################################ UPDATE BOOKS BY BOOK-ID ##########################################################*/

const updateBook = async (req, res) => {
    try {
      let Id = req.params.bookId
  
      if(!ObjectId.isValid(Id)){
        return res.status(400).send({ status: false, msg: "Book Id is Invalid" })
    }

      let data = req.body
      let { title, excerpt, releasedAt, ISBN} = data

      let obj = {}
        if (data.title){
            obj.title = data.title.trim().split(" ").filter(word=>word).join(" ")
        }
        if (data.excerpt){
            obj.excerpt = data.excerpt.trim().split(" ").filter(word=>word).join(" ")
        }
        if (data.ISBN){
            obj.ISBN = data.ISBN.trim().split("-").filter(word=>word).join("")
        }
        if (data.releasedAt){
            obj.releasedAt = data.releasedAt
        }
      
      let book = await bookModel.findById(Id)
      if (!book) {
        return res.status(404).send({status: false, msg: `User with Id- ${Id} is not present in collection` })
      }
      if (book.isDeleted==true) {
        return res.status(404).send({status: false, msg: 'Document already deleted' })
      }

      const titleExist = await bookModel.findOne({ title: title })

        if (titleExist) {
            return res.status(409).send({ status: false, msg: "Title already exits" })
        }

        const isbnExist = await bookModel.findOne({ ISBN: ISBN })

        if (isbnExist) {
            return res.status(409).send({ status: false, msg: "ISBN already exits" })
        }

                
      let updatedBook = await bookModel.findOneAndUpdate(
        { _id: Id, isDeleted: false }, obj,
        { returnDocument: 'after' },
      )

      return res.status(200).send({ status: true, message:'Success', data: updatedBook })
    } 
    catch(err) {
      return res.status(500).send({ status: false, message: err.message })
    }
 }  




module.exports.createBookDocument = createBookDocument;
module.exports.getBook = getBook;
module.exports.updateBook = updateBook;
