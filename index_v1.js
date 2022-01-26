// Main Backend File

const db = require ('./database');

// console.log(db);

const express = require ('express');

const app = express();

app.use(express.json());

//Import the mongoose module
var mongoose = require('mongoose');
//Set up default mongoose connection
var mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>console.log("CONNECTION ESTABLISHED"));

app.get("/", (req, res) => {
    return res.json({"Welcome": `Welcome to my backenf software of book disttribution`});
})

// http://localhost:3000/books
app.get("/books", (req, res) => {
    const getAllBooks = db.books;
    return res.json(getAllBooks);
})

// http://localhost:3000/book-isbn/12345ONE
app.get("/book-isbn/:isbn", (req, res) => {
    const {isbn} = req.params;
    const getSpecificBook = db.books.filter((book)=>book.ISBN === isbn);
    if(getSpecificBook.length===0)
    {
        return res.json({"error": `No Book found for the ISBN of ${isbn}`});
    }
    return res.json(getSpecificBook[0]);
})

// http://localhost:3000/book-category/programming
app.get("/book-category/:category", (req, res) => {
    const {category} = req.params;
    console.log(category)
    const getSpecificBookCategory = db.books.filter((book)=>book.category.includes(category));
    if(getSpecificBookCategory.length===0)
    {
        return res.json({"error": `No Book found for the Category of ${category}`});
    }
    return res.json(getSpecificBookCategory);
})

// http://localhost:3000/authors
app.get("/authors", (req, res) => {
    const getAllAuthors = db.authors;
    return res.json(getAllAuthors);
})

// http://localhost:3000/author-id/1
app.get("/author-id/:id", (req, res) => {
    let {id} = req.params;
    id = Number(id);
    const getSpecificAuthor = db.authors.filter((author)=> author.id === id);
    if(getSpecificAuthor.length===0)
    {
        return res.json({"error": `No Author found for the id of ${id}`});
    }
    return res.json(getSpecificAuthor[0]);
})


// http://localhost:3000/author-books/12345ONE
app.get("/author-books/:books", (req, res) => {
    const {books} = req.params;
    console.log(books);
    const getSpecificBookWritten = db.authors.filter((author)=>author.books.includes(books));
    if(getSpecificBookWritten.length===0)
    {
        return res.json({"error": `No Book found for the ISBN of ${books} by the author`});
    }
    return res.json(getSpecificBookWritten);
})

// http://localhost:3000/publications
app.get("/publications", (req, res) => {
    const getAllPublication = db.publications;
    return res.json(getAllPublication);
})

// http://localhost:3000/publication-books/12345Two
app.get("/publication-books/:books", (req, res) => {
    const {books} = req.params;
    console.log(books);
    const getSpecificBookPublished = db.publications.filter((publication)=>publication.books.includes(books));
    if(getSpecificBookPublished.length===0)
    {
        return res.json({"error": `No Book found for the ISBN of ${books} by the publication`});
    }
    return res.json(getSpecificBookPublished);
})

app.post("/books", (req, res) => {
    db.books.push(req.body);
    return res.json(db.books);
})

app.post("/authors", (req, res) => {
    db.authors.push(req.body);
    return res.json(db.authors);
})

app.post("/publications", (req, res) => {
    db.publications.push(req.body);
    return res.json(db.publications);
})

// http://localhost:3000/book-update/12345ONE
app.put("/book-update/:isbn",(req,res) => {
    // console.log(req.body);
    // console.log(req.params);
    const {isbn} = req.params;
    db.books.forEach((book) => {
        if(book.ISBN === isbn){
            return{...book, ...req.body};
        }
        return book;
    })
    return res.json(db.books);
})

//  http://localhost:3000/author-update/1
app.put("/author-update/:id",(req,res) => {
    let {id} = req.params;
    id = Number(id);
    db.authors.forEach((author) => {
        if(author.id === id){
            // console.log({...author, ...req.body});
            return{...author, ...req.body};
        }
        return author;
    })
    return res.json(db.authors);
})

//  http://localhost:3000/publication-update/2
app.put("/publication-update/:id",(req,res) => {
    let {id} = req.params;
    id = Number(id);
    db.publications.forEach((publication) => {
        if(publication.id === id){
            // console.log({...publication, ...req.body});  
            return{...publication, ...req.body};
        }
        return publication;
    })
    return res.json(db.publications);
})


// http://localhost:3000/book-delete/12345ONE
app.delete("/book-delete/:isbn",(req,res) => {
    // console.log(req.params);
    const {isbn} = req.params;
    const filteredBooks = db.books.filter((book) => book.ISBN != isbn);
    console.log(filteredBooks);
    db.books = filteredBooks;
    return res.json(filteredBooks);
})

// http://localhost:3000/book-author-delete/12345ONE/1
app.delete("/book-author-delete/:isbn/:id", (req, res) => {
    let {isbn, id} = req.params;
    id = Number(id);
    db.books.forEach((book) => {
        if(book.ISBN === isbn) {
            if(!book.authors.includes(id)) {
                return;
            }
            book.authors = book.authors.filter((author) => author!==id);
            return book;
        }
        return book;
    })
    return res.json(db.books);
});

// http://localhost:3000/author-book-delete/1/12345ONE
app.delete("/author-book-delete/:id/:isbn",(req,res) => {
    let {id, isbn} = req.params;
    id = Number(id);
    db.authors.forEach((author) => {
        if(author.id === id) {
            if(!author.books.includes(isbn)) {
                return ;
            }
            author.books = author.books.filter((book) => book != isbn);
        }
        return author;
    })
    return res.json(db.authors);
});

// http://localhost:3000/author-delete/2
app.delete("/author-delete/:id",(req,res) => {
    let {id} = req.params;
    id = Number(id);
    const filteredAuthors = db.authors.filter((author) => author.id != id);
    db.authors = filteredAuthors;
    return res.json(filteredAuthors);
})

// http://localhost:3000/publication-delete/1
app.delete("/publication-delete/:id",(req,res) => {
    let {id} = req.params;
    id = Number(id);
    const filteredPublications = db.publications.filter((publication) => publication.id != id);
    db.publications = filteredPublications;
    return res.json(filteredPublications);
})

app.listen(3000, ()=>{
    console.log("My express app is running..");
})