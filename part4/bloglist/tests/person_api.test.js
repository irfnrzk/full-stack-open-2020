const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
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
describe('successful blog post with HTTP POST request to /api/blogs', () => {

  test('total blogs increased by 1', async () => {
    await api
      .post('/api/blogs')
      .send({
        title: 'Fullstack Open 2020',
        author: 'Matti Luukainen',
        url: 'https://fullstackopen.com/en',
        likes: 15,
      })

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(listWithManyBlog.length + 1)
  })

  test('blog post returns 201 created & json', async () => {
    const blog = {
      title: 'Fullstack Open 2020',
      author: 'Matti Luukainen',
      url: 'https://fullstackopen.com/en',
      likes: 15,
    }

    const response = await api
      .post('/api/blogs')
      .send(blog)
      .expect(201)

    expect(response.body).toMatchObject(blog)
  })

  test('content of the blog post is saved correctly', async () => {
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
test('missing "likes" property from request will default to 0', async () => {
  await api
    .post('/api/blogs')
    .send({
      title: 'Fullstack Open 2020',
      author: 'Matti Luukainen',
      url: 'https://fullstackopen.com/en'
    })

  const response = await api.get('/api/blogs')
  expect(response.body[listWithManyBlog.length]).toHaveProperty('likes', 0)
})

// 4.12 verifies if the title and url properties are missing from the request data, the backend responds to the request with the status code 400 Bad Request
describe('unsuccessful blog post with HTTP POST request to /api/blogs', () => {

  test('respond 400 if title is missing from post body', async () => {
    await api.get('/api/blogs')
    const blog = {
      author: 'Matti Luukainen',
      url: 'https://fullstackopen.com/en',
      likes: 15,
    }

    await api
      .post('/api/blogs')
      .send(blog)
      .expect(400)
  })

  test('respond 400 if url is missing from post body', async () => {
    await api.get('/api/blogs')
    const blog = {
      title: 'Fullstack Open 2020',
      author: 'Matti Luukainen',
      likes: 15,
    }

    await api
      .post('/api/blogs')
      .send(blog)
      .expect(400)
  })
})

// 4.13 verifies that making an HTTP DELETE request to the /api/blogs/:id removes the post
describe('remove blog post with HTTP DELETE request to /api/blogs/:id', () => {

  test('total blogs decreased by 1', async () => {
    let id
    await api
      .get('/api/blogs')
      .then(res => id = res.body[listWithManyBlog.length - 1].id)

    await api.delete(`/api/blogs/${id}`)

    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(listWithManyBlog.length - 1)
  })

  test('blog post returns 204 no content', async () => {
    let id
    await api
      .get('/api/blogs')
      .then(res => id = res.body[listWithManyBlog.length - 1].id)

    await api
      .delete(`/api/blogs/${id}`)
      .expect(204)
  })

  test('searching for the deleted id returns 404 no content', async () => {
    let id
    await api
      .get('/api/blogs')
      .then(res => id = res.body[listWithManyBlog.length - 1].id)

    await api.delete(`/api/blogs/${id}`)
    await api
      .get(`/api/blogs/${id}`)
      .expect(404)
  })
})

// 4.14 verifies that making an HTTP PUT request to the /api/blogs/:id updates the post
describe('update blog post with HTTP PUT request to /api/blogs/:id', () => {

  test('update post returns 201 created & json', async () => {
    let id
    await api
      .get('/api/blogs')
      .then(res => id = res.body[listWithManyBlog.length - 1].id)

    const updateBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 10,
    }

    await api
      .put(`/api/blogs/${id}`)
      .send(updateBlog)
      .expect(200)

    const response = await api.get(`/api/blogs/${id}`)
    expect(response.body).toMatchObject(updateBlog)
  })

  test('update amount of likes', async () => {
    let id
    await api
      .get('/api/blogs')
      .then(res => id = res.body[listWithManyBlog.length - 1].id)

    await api
      .put(`/api/blogs/${id}`)
      .send({
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 10,
      })

    const response = await api.get(`/api/blogs/${id}`)
    expect(response.body.likes).toBe(10)
  })
})

afterAll(() => {
  mongoose.connection.close()
})