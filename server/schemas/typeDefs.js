const typeDefs = `
type User {
    _id: ID 
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book] // list of books saved by the user
}

type Book {
    bookId: ID
    authors: [String]
    description: String
    title: String
    image: String // url to book's image
    link: String // url to more info about book
}

type Auth {
    token: ID!  // authentication token (no null)
    user: User  // authenticated user
}

type Query {
    me: User // query to get currently logged-in user's info
}

type Mutation {
    login(email: String!, password: String!): Auth // logs in a user with email and password, returns Auth type
    createUser(username: String!, email: String!, password: String!): Auth // creates new user, returns Auth type
    saveBook(bookData: BookInput!): User // Mutation to save a book for the logged-in user, returns updated user
    deleteBook(bookId: ID!): User // deletes a saved book for logged-in user, returns updated user
}

input BookInput {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String  // url to book's image
    link: String   // url to more info about book
}
`;

module.exports = typeDefs;
