const dummy = (blogs) => {
  let Arr = blogs // eslint-disable-line
  return 1
}

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

module.exports = {
  dummy,
  totalLikes
}