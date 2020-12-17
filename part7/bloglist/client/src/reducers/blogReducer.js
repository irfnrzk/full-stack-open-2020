import blogService from "../services/blogs"
import { hideNotification, setNotification } from "./notificationReducer"

const initialState = []

const blogReducer = (state = initialState, action) => {

  switch (action.type) {
    case 'INIT_BLOG':
      return action.data.sort((a, b) => b.likes - a.likes)

    case 'ADD_BLOG':
      const newBlog = action.data
      const updatedBlogList = [...state, newBlog]
      return updatedBlogList

    default:
      return state
  }

}

export const initializeBlog = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    console.log(blogs)
    dispatch({
      type: 'INIT_BLOG',
      data: blogs
    })
  }
}

export const createBlog = (post) => {
  return async dispatch => {
    const blog = await blogService.create(post)
    dispatch(initializeBlog())
    dispatch(setNotification(`a new blog ${blog.title} by ${blog.author} added`, 'success'))
    setTimeout(() => {
      dispatch(hideNotification())
    }, 2000)
  }
}

export const addLike = (post) => {
  return async dispatch => {
    await blogService.update({ ...post, likes: post.likes + 1 })
    dispatch(initializeBlog())
  }
}

export const deleteBlog = (id, title, author) => {
  return async dispatch => {
    await blogService.remove(id)
    dispatch(setNotification(`${title} by ${author} removed`, 'success'))
    setTimeout(() => {
      dispatch(hideNotification())
    }, 2000)
    dispatch(initializeBlog())
  }
}

export default blogReducer