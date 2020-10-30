const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter
  .get('/', async (request, response) => {
    const blogs = await Blog.find({})

    if (blogs) {
      response.json(blogs)
    } else {
      response.status(404).end()
    }
  })

  .post('/', async (request, response) => {
    const blog = new Blog(request.body)
    const savedBlog = await blog.save()
    if (savedBlog) {
      response.status(201).json(savedBlog)
    } else {
      response.status(404).end()
    }
  })

module.exports = blogsRouter