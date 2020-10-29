const _ = require('lodash')

const dummy = (blogs) => {
  let Arr = blogs // eslint-disable-line
  return 1
}

//  function returns the total sum of likes in all of the blog posts
const totalLikes = (blogs) => {
  let sum = 0
  if (blogs.length === 0) {
    return 0
  } else if (blogs.length > 0) {
    blogs.forEach(blog => {
      sum += blog.likes
    })
    return sum
  }
}

//  function finds out which blog has most likes
//  if there are many top favorites, it is enough to return one of them
const favoriteBlog = (blogs) => {
  const max = blogs.reduce((prev, current) => (prev.likes > current.likes) ? prev : current)
  return max
}

//  function returns the author who has the largest amount of blogs
//  if there are many top bloggers, then it is enough to return any one of them
const mostBlogs = (blogs) => {
  const unique = _.uniqBy(blogs, 'author')

  let authors = []
  unique.forEach(author => { authors.push(author.author) })

  const countList = authors.map(author => {
    return {
      author: author,
      blogs: (() => {
        let count = 0
        blogs.forEach(blog => {
          if (blog.author === author) {
            count++
          }
        })
        return count
      })()
    }
  })

  const max = countList.reduce((prev, current) =>
    (prev.blogs > current.blogs) ?
      prev :
      current
  )

  return max
}

//  function returns the author, whose blog posts have the largest amount of like
//  if there are many top favorites, it is enough to return one of them
const mostLikes = (blogs) => {
  const unique = _.uniqBy(blogs, 'author')

  let authors = []
  unique.forEach(author => { authors.push(author.author) })

  const countList = authors.map(author => {
    return {
      author: author,
      likes: (() => {
        let count = 0
        blogs.forEach(blog => {
          if (blog.author === author) {
            count = count + blog.likes
          }
        })
        return count
      })()
    }
  })

  const max = countList.reduce((prev, current) =>
    (prev.likes > current.likes) ?
      prev :
      current
  )

  return max
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}