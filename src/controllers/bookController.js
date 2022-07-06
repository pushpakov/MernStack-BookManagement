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

const getBook = async (req, res)=>{
    const detailFromQuery = req.query;
    let filter = {
        isDeleted: false
    };
    if(detailFromQuery.userId){
        filter.userId = detailFromQuery.userId
    }
    if(detailFromQuery.category){
        filter.category = detailFromQuery.category
    }
    if(detailFromQuery.subcategory){
        filter.subcategory = detailFromQuery.subcategory
    }

    const books = await bookModel.find(filter).select({ISBN: 0, deletedAt: 0, isDeleted: 0});
    if(books.length === 0){
        res.status(400).send({status: false, msg: 'No book found'});
        return
    }
    res.status(200).send({status: true, data: books});
   }
module.exports.createBookDocument = createBookDocument
module.exports.getBook = getBook
