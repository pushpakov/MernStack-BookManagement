/*### POST /books
- Create a book document from request body. Get userId in request body only.
- Make sure the userId is a valid userId by checking the user exist in the users collection.
- Return HTTP status 201 on a succesful book creation. Also return the book document. The response should be a JSON object like [this](#successful-response-structure) 
- Create atleast 10 books for each user
- Return HTTP status 400 for an invalid request with a response body like [this](#error-response-structure)
*/
const bookModel = require('../models/bookModel')
const userModel = require('../models/userModel')


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
            reviews,
            deletedAt,
            isDeleted,
            releasedAt
        }
            = data
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "Please provide necessary Book Details" })
        }


        let validId = await userModel.findById(userId)
        if (!validId) {
            return res.status(400).send({ status: false, msg: 'userId is not Valid Id' })
        }
        let savedData = await bookModel.create(data)
        return res.status(201).send({ status: true, data: savedData })

    }
    catch {
        console.log(err)
        return res.status(500).send({ status: false, msg: err.message })

    }
}

module.exports.createBookDocument = createBookDocument

