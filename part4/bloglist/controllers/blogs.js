const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter
  .get('/', async (request, response) => {
    const blogs = await Blog
      .find({})
      .populate('user', {
        username: 1,
        name: 1,
        id: 1
      })

    response.json(blogs)
  })

  .get('/:id', async (request, response) => {
    const blog = await Blog
      .findById(request.params.id)
      .populate('user', {
        username: 1,
        name: 1,
        id: 1
      })

    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  })

  .delete('/:id', async (request, response) => {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const user = await User.findById(decodedToken.id)

    // find id of user who posted the blog
    const blog = await Blog.findById(request.params.id)
    if (blog.user.toString() === user._id.toString()) {
      await Blog.findByIdAndDelete(request.params.id)
      response.status(204).end()
    } else {
      response.status(401).end('Unauthorized')
    }

  })

  .post('/', async (request, response) => {
    const body = request.body
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const user = await User.findById(decodedToken.id)

    const blog = new Blog({
      title: body.title,
      url: body.url,
      likes: body.likes || 0,
      author: body.author,
      user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    const result = await Blog
      .findById(blog._id)
      .populate('user', {
        username: 1,
        name: 1,
        id: 1
      })

    if (result) {
      response.json(result)
    }
  })

  .put('/:id', async (request, response) => {
    const body = request.body
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    await User.findById(decodedToken.id)

    await Blog.findByIdAndUpdate(
      request.params.id,
      {
        title: body.title,
        url: body.url,
        likes: body.likes || 0,
        author: body.author
      },
      {
        new: true,
        runValidators: true
      }
    )

    const blog = await Blog
      .findById(request.params.id)
      .populate('user', {
        username: 1,
        name: 1,
        id: 1
      })

    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }

  })

module.exports = blogsRouter