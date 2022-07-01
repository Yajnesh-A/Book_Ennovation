const { user } = require('./model/usersAndRoles')

function adminControl(user) {
    return (
        user.userType === 'Admin'
    )
}

function dedicatedBook(user, books) {
    if (user.userType === 'Admin') return books
    return books.filter(book => book.authorId === user.id)
}

module.exports = {
    adminControl,
    dedicatedBook,
}