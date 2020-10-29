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

//  function returns the author who has the largest amount of blogs
//  the return value also contains the number of blogs the top author has
const favoriteBlog = (blogs) => {

  const max = blogs.reduce((prev, current) => (prev.likes > current.likes) ? prev : current)
  return max

}

//  function finds out which blog has most likes
//  if there are many top favorites, it is enough to return one of them
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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}