const { ApolloServer, UserInputError, AuthenticationError, gql } = require('apollo-server')
const mongoose = require('mongoose')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const jwt = require('jsonwebtoken')
const { PubSub } = require('apollo-server')
const pubsub = new PubSub()

const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY'

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
    allGenres: [String]
    findBookCount(name: String!): Book
    me: User
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  
  type Token {
    value: String!
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

    createUser(
      username: String!
      favoriteGenre: String
    ): User

    login(
      username: String!
      password: String!
    ): Token
  }

  type Subscription {
    bookAdded: Book!
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
      console.log('Author.find')
      return await Author.find({})
    },
    allBooks: async (_, args) => {
      let findBook = await Book.find({}).populate('author')
      if (args.author !== undefined) {
        findBook = findBook.filter(b => b.author.name === args.author)
      }
      if (args.genre !== undefined) {
        findBook = findBook.filter(b => b.genres.includes(args.genre))
      }
      return findBook
    },
    allGenres: async (_, args) => {
      let findBook = await Book.find({})
      const Arr = []
      findBook.forEach(x => {
        x.genres.forEach(y => {
          Arr.push(y)
        })
      })
      return [...new Set(Arr)]
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  // Author: {
  //   bookCount: async (root, args, context, info) => {
  //     console.log('bookCount.find')
  //     console.log(info)
  //     const books = await Book.find({}).populate('author')
  //     return books ? books.filter(b => b.author.name === root.name).length : 0
  //   }
  // },
  Mutation: {
    addBook: async (_, args, { currentUser }) => {

      if (!currentUser) {
        throw (new AuthenticationError("not authenticated"))
      }

      const findAuthor = await Author.findOne({ name: args.author })
      try {

        let author
        if (!findAuthor) {
          author = new Author({ name: args.author })
          await author.save()
        } else {
          author = findAuthor
        }

        const book = new Book({ ...args, author: author })
        const response = await book.save()

        const bookCount = await Book.find({
          author: author.id,
        }).countDocuments()

        await Author.findOneAndUpdate(
          { name: author.name },
          { bookCount: bookCount }
        )

        pubsub.publish('BOOK_ADDED', { bookAdded: book })
        return response

      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }


    },
    editAuthor: async (_, args, { currentUser }) => {
      if (!currentUser) {
        throw (new AuthenticationError("not authenticated"))
      }
      try {
        const findAuthor = await Author.findOne({ name: args.name })
        findAuthor.born = args.setBornTo
        return await findAuthor.save()
      } catch (err) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
    },
    createUser: (_, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })

      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        })
    },
    login: async (_, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'sekret') {
        throw new UserInputError("wrong credentials")
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, JWT_SECRET) }
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User.findById(decodedToken.id).populate('friends')
      return { currentUser }
    }
  }
})

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})