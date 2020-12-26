const { ApolloServer, UserInputError, gql } = require('apollo-server')
const mongoose = require('mongoose')
const Author = require('./models/author')
const Book = require('./models/book')

const MONGODB_URI = 'mongodb+srv://fullstack:fullstack@cluster0.sqszd.mongodb.net/graphql?retryWrites=true'

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = gql`
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book]
    allAuthors: [Author!]!
    findBookCount(name: String!): Book
  }

  type Author {
    name: String!
    id: ID!
    born: Int,
    bookCount: Int
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book

    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`

const resolvers = {
  Query: {
    bookCount: () => { return Book.collection.countDocuments() },
    authorCount: () => { return Author.collection.countDocuments() },
    allBooks: async (_, args) => {
      let findBook = await Book.find({}).populate('author')
      if (args.author !== undefined) {
        findBook = findBook.filter(b => b.author.name === args.author)
      }
      return findBook
    },
    allAuthors: async () => {
      return await Author.find({})
    },
  },
  Author: {
    bookCount: async (root) => {
      const books = await Book.find({}).populate('author')
      return books ? books.filter(b => b.author.name === root.name).length : 0
    }
  },
  Mutation: {
    addBook: async (_, args) => {

      const findAuthor = await Author.findOne({ name: args.author })

      try {

        let author
        if (!findAuthor) {
          console.log('new')
          author = new Author({ name: args.author })
          await author.save()
        } else {
          author = findAuthor
        }

        const book = new Book({ ...args, author: author })
        return await book.save()

      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }

    },
    editAuthor: async (_, args) => {
      try {
        const findAuthor = await Author.findOne({ name: args.name })
        findAuthor.born = args.setBornTo
        return await findAuthor.save()
      } catch (err) {

      }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})