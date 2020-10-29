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
//  ff there are many top favorites, it is enough to return one of them
const favoriteBlog = (blogs) => {

  const max = blogs.reduce((prev, current) => (prev.likes > current.likes) ? prev : current)
  return max

}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}