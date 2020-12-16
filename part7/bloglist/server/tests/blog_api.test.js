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
    user: '5f9d02cad213823b143d5049'
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    user: '5f9d02bfd213823b143d5048'
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    user: '5f9d02bfd213823b143d5048'
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 1,
    user: '5f9d02b0d213823b143d5047'
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    user: '5f9d02b0d213823b143d5047'
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    user: '5f9d02b0d213823b143d5047'
  }
]

// Initializing the database before tests
beforeEach(async () => {
  await Blog.deleteMany({})

  // order matters for PUT
  for (let blog of listWithManyBlog) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }

  // const blogObjects = listWithManyBlog.map(blog => new Blog(blog))
  // const promiseArray = blogObjects.map(blog => blog.save())
  // await Promise.all(promiseArray)
})

test('get blogs request are returned as json', async () => {
  // login as matti to get token
  const loginUser = await api
    .post('/api/login')
    .send({
      username: 'matti',
      password: 'sekret'
    })

  const token = loginUser.body.token

  await api
    .get('/api/blogs')
    .set({ Authorization: `Bearer ${token}` })
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('get blogs request fails if token not set', async () => {

  await api
    .get('/api/blogs')
    .expect(401)
    .expect('Content-Type', /application\/json/)
})

// 4.8 verify that the blog list application returns the correct amount of blog posts in the JSON format.
test('blogs length', async () => {
  const loginUser = await api
    .post('/api/login')
    .send({
      username: 'matti',
      password: 'sekret'
    })

  const token = loginUser.body.token
  const response = await api
    .get('/api/blogs')
    .set({ Authorization: `Bearer ${token}` })

  expect(response.body).toHaveLength(listWithManyBlog.length)
})

// 4.9 verifies that the unique identifier property of the blog posts is named id
test('blogs have an id property', async () => {
  const loginUser = await api
    .post('/api/login')
    .send({
      username: 'matti',
      password: 'sekret'
    })

  const token = loginUser.body.token
  const response = await api
    .get('/api/blogs')
    .set({ Authorization: `Bearer ${token}` })

  response.body.forEach(el => {
    expect(el.id).toBeDefined()
  })
})

// 4.10 verifies that making an HTTP POST request to the /api/blogs url successfully creates a new blog post
describe('successful blog post with HTTP POST request to /api/blogs', () => {

  test('total blogs increased by 1', async () => {
    const loginUser = await api
      .post('/api/login')
      .send({
        username: 'matti',
        password: 'sekret'
      })

    const token = loginUser.body.token

    await api
      .post('/api/blogs')
      .set({ Authorization: `Bearer ${token}` })
      .send({
        title: 'Fullstack Open 2020',
        author: 'Matti Luukainen',
        url: 'https://fullstackopen.com/en',
        likes: 15,
      })

    const response = await api
      .get('/api/blogs')
      .set({ Authorization: `Bearer ${token}` })

    expect(response.body).toHaveLength(listWithManyBlog.length + 1)
  })

  test('blog post returns 201 created & json', async () => {
    const loginUser = await api
      .post('/api/login')
      .send({
        username: 'matti',
        password: 'sekret'
      })

    const token = loginUser.body.token

    const blog = {
      title: 'Fullstack Open 2020',
      author: 'Matti Luukainen',
      url: 'https://fullstackopen.com/en',
      likes: 15,
    }

    const response = await api
      .post('/api/blogs')
      .set({ Authorization: `Bearer ${token}` })
      .send(blog)
      .expect(201)

    expect(response.body).toMatchObject(blog)
  })

  test('content of the blog post is saved correctly', async () => {
    const loginUser = await api
      .post('/api/login')
      .send({
        username: 'matti',
        password: 'sekret'
      })

    const token = loginUser.body.token

    const blog = {
      title: 'Fullstack Open 2020',
      author: 'Matti Luukainen',
      url: 'https://fullstackopen.com/en',
      likes: 15,
    }

    await api
      .post('/api/blogs')
      .set({ Authorization: `Bearer ${token}` })
      .send(blog)

    const response = await api
      .get('/api/blogs')
      .set({ Authorization: `Bearer ${token}` })

    expect(response.body[listWithManyBlog.length]).toMatchObject(blog)
  })
})

// 4.11 verifies if the likes property is missing from the request, it will default to 0
test('missing "likes" property from request will default to 0', async () => {
  const loginUser = await api
    .post('/api/login')
    .send({
      username: 'matti',
      password: 'sekret'
    })

  const token = loginUser.body.token

  await api
    .post('/api/blogs')
    .set({ Authorization: `Bearer ${token}` })
    .send({
      title: 'Fullstack Open 2020',
      author: 'Matti Luukainen',
      url: 'https://fullstackopen.com/en'
    })

  const response = await api
    .get('/api/blogs')
    .set({ Authorization: `Bearer ${token}` })

  expect(response.body[listWithManyBlog.length]).toHaveProperty('likes', 0)
})

// 4.12 verifies if the title and url properties are missing from the request data, the backend responds to the request with the status code 400 Bad Request
describe('unsuccessful blog post with HTTP POST request to /api/blogs', () => {

  test('respond 401 if a token is not provided', async () => {
    const loginUser = await api
      .post('/api/login')
      .send({
        username: 'matti',
        password: 'sekret'
      })

    const token = loginUser.body.token

    await api
      .get('/api/blogs')
      .set({ Authorization: `Bearer ${token}` })

    const blog = {
      author: 'Matti Luukainen',
      url: 'https://fullstackopen.com/en',
      likes: 15,
    }

    await api
      .post('/api/blogs')
      .send(blog)
      .expect(401)
  })


  test('respond 400 if title is missing from post body', async () => {
    const loginUser = await api
      .post('/api/login')
      .send({
        username: 'matti',
        password: 'sekret'
      })

    const token = loginUser.body.token

    await api
      .get('/api/blogs')
      .set({ Authorization: `Bearer ${token}` })

    const blog = {
      author: 'Matti Luukainen',
      url: 'https://fullstackopen.com/en',
      likes: 15,
    }

    await api
      .post('/api/blogs')
      .set({ Authorization: `Bearer ${token}` })
      .send(blog)
      .expect(400)
  })

  test('respond 400 if url is missing from post body', async () => {
    const loginUser = await api
      .post('/api/login')
      .send({
        username: 'matti',
        password: 'sekret'
      })

    const token = loginUser.body.token

    await api
      .get('/api/blogs')
      .set({ Authorization: `Bearer ${token}` })

    const blog = {
      title: 'Fullstack Open 2020',
      author: 'Matti Luukainen',
      likes: 15,
    }

    await api
      .post('/api/blogs')
      .set({ Authorization: `Bearer ${token}` })
      .send(blog)
      .expect(400)
  })
})

// 4.13 verifies that making an HTTP DELETE request to the /api/blogs/:id removes the post
describe('remove blog post with HTTP DELETE request to /api/blogs/:id', () => {

  test('total blogs decreased by 1', async () => {
    const loginUser = await api
      .post('/api/login')
      .send({
        username: 'Robert',
        password: 'sekret'
      })

    const token = loginUser.body.token

    let id
    await api
      .get('/api/blogs')
      .set({ Authorization: `Bearer ${token}` })
      .then(res => id = res.body[listWithManyBlog.length - 1].id)

    await api
      .delete(`/api/blogs/${id}`)
      .set({ Authorization: `Bearer ${token}` })

    const response = await api
      .get('/api/blogs')
      .set({ Authorization: `Bearer ${token}` })
    expect(response.body).toHaveLength(listWithManyBlog.length - 1)
  })

  test('blog post returns 204 no content', async () => {
    const loginUser = await api
      .post('/api/login')
      .send({
        username: 'Robert',
        password: 'sekret'
      })

    const token = loginUser.body.token

    let id
    await api
      .get('/api/blogs')
      .set({ Authorization: `Bearer ${token}` })
      .then(res => id = res.body[listWithManyBlog.length - 1].id)

    await api
      .delete(`/api/blogs/${id}`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(204)
  })

  test('searching for the deleted id returns 404 no content', async () => {
    const loginUser = await api
      .post('/api/login')
      .send({
        username: 'Robert',
        password: 'sekret'
      })

    const token = loginUser.body.token

    let id
    await api
      .get('/api/blogs')
      .set({ Authorization: `Bearer ${token}` })
      .then(res => id = res.body[listWithManyBlog.length - 1].id)

    await api
      .delete(`/api/blogs/${id}`)
      .set({ Authorization: `Bearer ${token}` })

    await api
      .get(`/api/blogs/${id}`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(404)
  })

  test('deleting using different user return 401 unauthorized', async () => {
    const loginUser = await api
      .post('/api/login')
      .send({
        username: 'matti',
        password: 'sekret'
      })

    const token = loginUser.body.token

    let id
    await api
      .get('/api/blogs')
      .set({ Authorization: `Bearer ${token}` })
      .then(res => id = res.body[listWithManyBlog.length - 1].id)

    await api
      .delete(`/api/blogs/${id}`)
      .set({ Authorization: `Bearer ${token}` })
      .expect(401)
  })
})

// 4.14 verifies that making an HTTP PUT request to the /api/blogs/:id updates the post
describe('update blog post with HTTP PUT request to /api/blogs/:id', () => {

  test('update post returns 200 created & json', async () => {
    const loginUser = await api
      .post('/api/login')
      .send({
        username: 'Robert',
        password: 'sekret'
      })

    const token = loginUser.body.token

    let id
    await api
      .get('/api/blogs')
      .set({ Authorization: `Bearer ${token}` })
      .then(res => id = res.body[listWithManyBlog.length - 1].id)

    const updateBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 10,
    }

    await api
      .put(`/api/blogs/${id}`)
      .set({ Authorization: `Bearer ${token}` })
      .send(updateBlog)
      .expect(200)

    const response = await api
      .get(`/api/blogs/${id}`)
      .set({ Authorization: `Bearer ${token}` })

    expect(response.body).toMatchObject(updateBlog)
  })

  test('update amount of likes', async () => {
    const loginUser = await api
      .post('/api/login')
      .send({
        username: 'Robert',
        password: 'sekret'
      })

    const token = loginUser.body.token

    let id
    await api
      .get('/api/blogs')
      .set({ Authorization: `Bearer ${token}` })
      .then(res => id = res.body[listWithManyBlog.length - 1].id)

    await api
      .put(`/api/blogs/${id}`)
      .set({ Authorization: `Bearer ${token}` })
      .send({
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 10,
      })
      .expect(200)

    const response = await api
      .get(`/api/blogs/${id}`)
      .set({ Authorization: `Bearer ${token}` })

    expect(response.body.likes).toBe(10)
  })

  test('update as someone else returns 401 unauthorized', async () => {
    const loginUser = await api
      .post('/api/login')
      .send({
        username: 'matti',
        password: 'sekret'
      })

    const token = loginUser.body.token

    let id
    await api
      .get('/api/blogs')
      .set({ Authorization: `Bearer ${token}` })
      .then(res => id = res.body[listWithManyBlog.length - 1].id)

    await api
      .put(`/api/blogs/${id}`)
      .set({ Authorization: `Bearer ${token}` })
      .send({
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 10,
      })
      .expect(401)
  })
})

afterAll(() => {
  mongoose.connection.close()
})