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
    const body = request.body
    const blog = new Blog({
      title: body.title,
      url: body.url,
      likes: body.likes || 0,
      author: body.author
    })
    const savedBlog = await blog.save()
    if (savedBlog) {
      response.status(201).json(savedBlog)
    } else {
      response.status(404).end()
    }
  })

module.exports = blogsRouter