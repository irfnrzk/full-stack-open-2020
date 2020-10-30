const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
// const Blogs = require('../controllers/blogs')
const Blog = require('../models/blog')
const listWithManyBlog = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 1,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  }
]

// Initializing the database before tests
beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = listWithManyBlog.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

// 4.8 verify that the blog list application returns the correct amount of blog posts in the JSON format.
test('blogs length', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(listWithManyBlog.length)
})

// 4.9 verifies that the unique identifier property of the blog posts is named id
test('blogs have an id property', async () => {
  const response = await api.get('/api/blogs')
  response.body.forEach(el => {
    expect(el.id).toBeDefined()
  })
})

// 4.10 verifies that making an HTTP POST request to the /api/blogs url successfully creates a new blog post
describe('successful blog post', () => {

  test('total blogs increased by 1', async () => {
    await api.get('/api/blogs')
    const blog = {
      title: 'Fullstack Open 2020',
      author: 'Matti Luukainen',
      url: 'https://fullstackopen.com/en',
      likes: 15,
    }

    await api
      .post('/api/blogs')
      .send(blog)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(listWithManyBlog.length + 1)
  })

  test('blog post returns 201 created & json', async () => {
    await api.get('/api/blogs')
    const blog = {
      title: 'Fullstack Open 2020',
      author: 'Matti Luukainen',
      url: 'https://fullstackopen.com/en',
      likes: 15,
    }

    const response = await api
      .post('/api/blogs')
      .send({
        title: 'Fullstack Open 2020',
        author: 'Matti Luukainen',
        url: 'https://fullstackopen.com/en',
        likes: 15,
      })
      .expect(201)

    expect(response.body).toMatchObject(blog)
  })

  test('content of the blog post is saved correctly', async () => {
    await api.get('/api/blogs')
    const blog = {
      title: 'Fullstack Open 2020',
      author: 'Matti Luukainen',
      url: 'https://fullstackopen.com/en',
      likes: 15,
    }

    await api
      .post('/api/blogs')
      .send(blog)

    const response = await api.get('/api/blogs')
    expect(response.body[listWithManyBlog.length]).toMatchObject(blog)
  })
})

// 4.11 verifies if the likes property is missing from the request, it will default to 0
test('default like is 0 when missing from post body', async () => {
  await api.get('/api/blogs')
  const blog = {
    title: 'Fullstack Open 2020',
    author: 'Matti Luukainen',
    url: 'https://fullstackopen.com/en'
  }

  await api
    .post('/api/blogs')
    .send(blog)

  const response = await api.get('/api/blogs')
  expect(response.body[listWithManyBlog.length]).toHaveProperty('likes', 0)
})

afterAll(() => {
  mongoose.connection.close()
})