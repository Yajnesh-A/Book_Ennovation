const mongoose = require('mongoose')

const BooksModel = new mongoose.Schema({
    authorId:{
        type: Number,
        required: true
    },
    bookName: {
        type: String,
        required: true
    },
    bookInfo: {
        type: String,
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    bookPage: {
        type: Number,
        required: true
    },
    bookPrice: {
        type: Number,
        required: true
    },
    authorType: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Books', BooksModel)