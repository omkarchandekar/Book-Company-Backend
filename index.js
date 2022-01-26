// Main Backend File

// console.log(db);

const express = require ('express');

const app = express();

require('dotenv').config();

app.use(express.json());

var mongoose = require('mongoose');

//Import the mongoose module
const BookModel = require('./database/books');
const AuthorModel = require('./database/authors');
const PublicationModel = require('./database/publications');
const UserModel = require('./database/users');
//Set up default mongoose connection
mongoose.connect(process.env.MONGODB_URI , {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>console.log("CONNECTION ESTABLISHED"));

app.get("/", (req, res) => {
    return res.json({"Welcome": `Welcome to my backend software of book disttribution company`});
})

// http://localhost:3000/books
app.get("/books", async (req, res) => {
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);
})

// http://localhost:3000/book-isbn/12345Two
app.get("/book-isbn/:isbn", async (req, res) => {
    const {isbn} = req.params;
    const getSpecificBook = await BookModel.findOne({ISBN :isbn});
    if(getSpecificBook===null)
    {
        return res.json({"error": `No Book found for the ISBN of ${isbn}`});
    }
    return res.json(getSpecificBook);
})

// http://localhost:3000/book-category/programming
app.get("/book-category/:category", async (req, res) => {
    const {category} = req.params;
    const getSpecificBookCategory = await BookModel.find({category : category});
    if(getSpecificBookCategory.length === 0)
    {
        return res.json({"error": `No Book found for the Category of ${category}`});
    }
    return res.json(getSpecificBookCategory);
})

// http://localhost:3000/authors
app.get("/authors", async (req, res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json(getAllAuthors);
})

// http://localhost:3000/author-id/1
app.get("/author-id/:id", async (req, res) => {
    let {id} = req.params;
    id = Number(id);
    const getSpecificAuthor = await AuthorModel.findOne({id : id});
    if(getSpecificAuthor.length === null)
    {
        return res.json({"error": `No Author found for the id of ${id}`});
    }
    return res.json(getSpecificAuthor);
})


// http://localhost:3000/author-books/12345ONE
app.get("/author-books/:books", async (req, res) => {
    const {books} = req.params;
    const getSpecificBookWritten = await AuthorModel.find({books : books})
    if(getSpecificBookWritten.length === 0)
    {
        return res.json({"error": `No Book found for the ISBN of ${books} by the author`});
    }
    return res.json(getSpecificBookWritten);
})

// http://localhost:3000/publications
app.get("/publications", async(req, res) => {
    const getAllPublication = await PublicationModel.find();
    return res.json(getAllPublication);
})

// http://localhost:3000/publication-books/12345Two
app.get("/publication-books/:books", async(req, res) => {
    const {books} = req.params;
    const getSpecificBookPublished = await PublicationModel.find({books : books});
    if(getSpecificBookPublished.length===0)
    {
        return res.json({"error": `No Book found for the ISBN of ${books} by the publication`});
    }
    return res.json(getSpecificBookPublished);
})

// http://localhost:3000/books
app.post("/books", async (req, res) => {
    const addNewBook = await BookModel.create(req.body);
    return res.json({
        bookAdded : addNewBook,
        message : "Book was Added"        
    });
})

// http://localhost:3000/authors
app.post("/authors", async(req, res) => {
    const addNewAuthor = await AuthorModel.create(req.body);
    return res.json({
        authorAdded : addNewAuthor,
        message : "Author was Added"        
    });
})

// http://localhost:3000/publications
app.post("/publications", async(req, res) => {
    const addNewPublication = await PublicationModel.create(req.body);
    return res.json({
        publicationAdded : addNewPublication,
        message : "Publication was Added"        
    });
})

// http://localhost:3000/book-update/12345ONE
app.put("/book-update/:isbn", async (req, res) => {
    const {isbn} = req.params;
    const updateBook = await BookModel.findOneAndUpdate({ISBN: isbn}, req.body, {new: true});
    return res.json( {bookUpdated: updateBook, message: "Book was updated !!!"} );
});

//  http://localhost:3000/author-update/1
app.put("/author-update/:id", async(req,res) => {
    let {id} = req.params;
    id = Number(id);
    const updateAuthor = await AuthorModel.findOneAndUpdate({id: id}, req.body, {new: true});
    return res.json( {authorUpdated: updateAuthor, message: "Author was updated !!!"} );
})

//  http://localhost:3000/publication-update/2
app.put("/publication-update/:id", async(req,res) => {
    let {id} = req.params;
    id = Number(id);
    const updatePublication = await PublicationModel.findOneAndUpdate({id: id}, req.body, {new: true});
    return res.json( {publicationUpdated: updatePublication, message: "Publication was updated !!!"} );
})


// http://localhost:3000/book-delete/12345ONE
app.delete("/book-delete/:isbn", async (req,res) => {
    // console.log(req.params);
    const {isbn} = req.params;
    const deleteBook = await BookModel.deleteOne({ISBN : isbn});
    return res.json({bookDeleted : deleteBook, message : "Book was Deleted"});
})

// http://localhost:3000/book-author-delete/12345One/1
app.delete("/book-author-delete/:isbn/:id", async (req, res) => {
    const {isbn, id} = req.params;
    let getSpecificBook = await BookModel.findOne({ISBN: isbn});
    if(getSpecificBook===null) {
        return res.json({"error": `No Book found for the ISBN of ${isbn}`});
    }
    else {
        getSpecificBook.authors.remove(id);
        const updateBook = await BookModel.findOneAndUpdate({ISBN: isbn}, getSpecificBook, {new: true});
        return res.json( {bookUpdated: updateBook, message: "Author was Deleted from the Book !!!"} );
    }
});

// http://localhost:3000/author-book-delete/1/12345ONE
app.delete("/author-book-delete/:id/:isbn", async (req, res) => {
    const {id, isbn} = req.params;
    let getSpecificAuthor = await AuthorModel.findOne({id: id});
    if(getSpecificAuthor===null) {
        return res.json({"error": `No Author found for the ID of ${id}`});
    }
    else {
        getSpecificAuthor.books.remove(isbn);
        const updateAuthor = await AuthorModel.findOneAndUpdate({id: id}, getSpecificAuthor, {new: true});
        return res.json( {authorUpdated: updateAuthor, message: "Book was Deleted from the Author !!!"} );
    }
});

// http://localhost:3000/author-delete/2
app.delete("/author-delete/:id", async(req,res) => {
    let {id} = req.params;
    id = Number(id);
    const deleteAuthor = await AuthorModel.deleteOne({id : id});
    return res.json({authorDeleted : deleteAuthor, message : "Author was Deleted"});
})

// http://localhost:3000/publication-delete/1
app.delete("/publication-delete/:id", async(req,res) => {
    let {id} = req.params;
    id = Number(id);
    const deletePublication = await PublicationModel.deleteOne({id : id});
    return res.json({publicationDeleted : deletePublication, message : "Publication was Deleted"});
})

// http://localhost:3000/users
app.post("/users", async (req, res) => {
    const addNewUser = await UserModel.create(req.body);
    return res.json({
        userAdded : addNewUser,
        message : "User was Added"        
    });
})

app.listen(3000, ()=>{
    console.log("My express app is running..");
})