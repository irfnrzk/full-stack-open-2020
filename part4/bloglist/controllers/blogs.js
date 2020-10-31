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
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
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
    response.status(201).json(savedBlog)
  })

  .put('/:id', async (request, response) => {
    const body = request.body
    const blog = {
      title: body.title,
      url: body.url,
      likes: body.likes || 0,
      author: body.author
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      blog,
      {
        new: true,
        runValidators: true
      }
    )
    response.json(updatedBlog)
  })

module.exports = blogsRouter