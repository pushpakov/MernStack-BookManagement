/*### POST /books
- Create a book document from request body. Get userId in request body only.
- Make sure the userId is a valid userId by checking the user exist in the users collection.
- Return HTTP status 201 on a succesful book creation. Also return the book document. The response should be a JSON object like [this](#successful-response-structure) 
- Create atleast 10 books for each user
- Return HTTP status 400 for an invalid request with a response body like [this](#error-response-structure)
*/
const bookModel = require('../models/bookModel')
const ObjectId = require('mongoose').Types.ObjectId;


let createBookDocument = async (req, res) => {
    try {
        let data = req.body

        let obj = {}

        let {
            title,
            excerpt,
            userId,
            ISBN,
            category,
            subcategory
        }
            = data

        obj.title = data.title.trim().split(" ").filter(word=>word).join(" ")
        obj.excerpt = data.logoLink.trim().split(" ").filter(word=>word).join(" ")
        obj.category = data.fullName.trim().split(" ").filter(word=>word).join(" ")
        obj.subcategory = data.subcategory.trim()
        obj.userId = data.userId.trim()
        obj.ISBN = data.ISBN.trim().split(" ").join("")
        obj.reviews = data.reviews
        obj.deletedAt = data.deletedAt
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

        if (!subcategory) {
            return res.status(400).send({ status: false, msg: "Subcategory is required" })
        }

        const titleExist = await bookModel.findOne({ title: title })

        if (titleExist) {
            return res.status(409).send({ status: false, msg: "Title already exits" })
        }

        const isbnExist = await bookModel.findOne({ ISBN: ISBN })

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
    catch {
        console.log(err)
        return res.status(500).send({ status: false, msg: err.message })

    }
}

module.exports.createBookDocument = createBookDocument
