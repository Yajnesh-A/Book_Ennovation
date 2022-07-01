For both get requests(get all books and getbookbyId)
    1. Send user Id listed in model/usersAndRoles.js in body
    Admin can view all the books, basic user can view their books only, i.e., userId == authorId
    2. Without the user Id, get request should display "You need to login" message
basically every requests needs login and some need admin user authentication