const express = require('express');
const app = express();
const PORT = 3000;


app.use(express.json());

// In-memory database
let me = {
    "studentNumber": "2603646"
}
let books = [
];
// function to validate the books field

function isDetailsValid(mybook) {

    if (!Array.isArray(mybook.details) || mybook.details.length === 0) {
        return false;
    }
    for (let detail of mybook.details) {
        if (!detail.id || !detail.author || !detail.genre || !detail.publicationYear) {
            return false;
        }
        if (typeof detail.publicationYear !== 'number' || isNaN(detail.publicationYear)) {
            return false;
        }
    }

    return true; 
    
}
function isBookValid(mybook) {
    let bValid = true;
    if (!mybook.id || !mybook.title) {
        bValid = false;
    }

    if (!isDetailsValid(mybook)) {
        bValid = false;
    }
    return bValid;
}



// GET all books
app.get('/whoami', (req, res) => {
    res.json(me);
});

// GET all books
app.get('/books', (req, res) => {
    res.json(books);
});


// CREATE book
app.post('/books', (req, res) => {
    const newBook = {
        id: books.length + 1,
        title: req.body.title,
        details: req.body.details
     
    };
  
    if (!isBookValid(newBook)) return res.status(400).json({
        message: 'error: Missing required book details'
    });


    books.push(newBook);
    res.status(201).json(newBook);
});


// adding details to the book

// CREATE book
app.post('/books/:id/details', (req, res) => {

    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) return res.status(404).json({
        message: 'Book not found'
    });

    const newBook = {

        details: req.body.details
     
    };

    if (!isDetailsValid(newBook)) return res.status(400).json({
        message: 'error: Missing required book details'
    });
    book.detail = newBook.details;
    res.status(201).json(newBook);
});

// UPDATE book
app.put('/books/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) return res.status(404).json({
        message: 'Book not found'
    });

    book.title = req.body.title || book.title;
    book.details = req.body.details||book.details

    res.json(book);
});

// DELETE book
app.delete('/books/:id', (req, res) => {
    const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
    if (bookIndex === -1) return res.status(404).json({
        message: 'Book not found'
    });

    books.splice(bookIndex, 1);
    res.json({
        message: 'Book deleted'
    });
});
// here im removing a detail from a book
app.delete('/books/:id/details/:detailId', (req, res) => {
    const bookId = parseInt(req.params.id);
    const detailId = req.params.detailId;
    const book = books.find(b => b.id === bookId);
    
    if (!book) {
        return res.status(404).json({
            message: 'Book not found'
        });
    }
    const detailIndex = book.details.findIndex(detail => detail.id === detailId);

    if (detailIndex === -1) {
        return res.status(404).json({
            message: 'Detail not found'
        });
    }
    book.details.splice(detailIndex, 1);
    res.json(book);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});