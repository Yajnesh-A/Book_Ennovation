const express = require('express')
const router = express.Router()
const bookModel = require('../model/bookSchema')
const { userAuth } = require('../userAuth')
const { adminControl, dedicatedBook } = require('../userPermission')
const multer = require('multer')

const imageStorage = multer.diskStorage({
    destination: function (req, file, callbackFn) {
        callbackFn(null, './uploads')
    },
    filename: function (req, file, callbackFn) {
        callbackFn(null, file.originalname)
    }
})

const imageFilter = (req, file, callbackFn) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        callbackFn(null, true)
    } else {
        callbackFn(null, false)
    }
}
// const upload = multer({dest: 'uploads/'})
const upload = multer(
    {
        storage: imageStorage,
        fileFilter: imageFilter
    }
)

router.get('/', userAuth, async (req, res) => {
    let allBooks = await bookModel.find()
    res.send(dedicatedBook(req.user, allBooks))
})

router.get('/:id', userAuth, adminAuth, getBook, async (req, res) => {
    res.json(req.book)
})

router.post('/', upload.single('bookInfo'), async (req, res) => {
    console.log(req.file)
    const addBook = new bookModel({
        authorId: req.body.authorId,
        bookName: req.body.bookName,
        bookInfo: req.file.path,
        authorName: req.body.authorName,
        bookPage: req.body.bookPage,
        bookPrice: req.body.bookPrice,
        authorType: req.body.authorType
    })
    try {
        const newBook = await addBook.save()
        res.json(newBook)
    } catch (err) {
        res.json({ "errorMessage": err.message })
    }
})

router.patch('/:id', getBook, async (req, res) => {
    if (req.body.authorId != null)
        res.book.authorId = req.body.authorId
    if (req.body.bookName != null)
        res.book.bookName = req.body.bookName
    if (req.body.bookInfo != null)
        res.book.bookInfo = req.body.bookInfo
    if (req.body.authorName != null)
        res.book.authorName = req.body.authorName
    if (req.body.bookPage != null)
        res.book.bookPage = req.body.bookPage
    if (req.body.bookPrice != null)
        res.book.bookPrice = req.body.bookPrice
    if (req.body.authorType != null)
        res.book.authorType = req.body.authorType
    try {
        const updateBook = await res.book.save()
        return res.json(updateBook)
    } catch (error) {
        return res.json({ "message": error.message })
    }
})

router.delete('/:id', userAuth, adminAuth, getBook, async (req, res) => {
    try {
        await res.book.remove()
        res.json({ message: "Book Deleted" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

function getBook(req, res, next) {
    return new Promise(async (resolve, reject) => {
        let book = await bookModel.findById(req.params.id)
        if (book == null) {
            reject(res.status(401).json({ "message": "Book not found" }))
        }
        else {
            resolve(res.status(201).json({ "bookFound": book }))
        }
        res.book = book
        next()
    })
}

function adminAuth(req, res, next) {
    if (!adminControl(req.user)) {
        res.status(401)
        return res.send('Not Allowed')
    }

    next()
}

module.exports = router