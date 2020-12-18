import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'
import {
  Button
} from '@material-ui/core'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

const CreateBlog = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [newBlog, setNewBlog] = useState({
    title: '',
    author: '',
    url: ''
  })

  const handlePost = (event) => {
    event.preventDefault()
    dispatch(createBlog(newBlog))
    setNewBlog({
      title: '',
      author: '',
      url: ''
    })
  }

  return (
    <>
      <h2>create new</h2>
      <form className={classes.root}>
        <div>
          <TextField
            id="outlined-number"
            label="Title"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            value={newBlog.title}
            onChange={({ target }) => setNewBlog({ ...newBlog, title: target.value })}
          />
        </div>
        <div>
          <TextField
            id="outlined-number"
            label="Author"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            value={newBlog.author}
            onChange={({ target }) => setNewBlog({ ...newBlog, author: target.value })}
          />
        </div>
        <div>
          <TextField
            id="outlined-number"
            label="URL"
            type="text"
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            value={newBlog.url}
            onChange={({ target }) => setNewBlog({ ...newBlog, url: target.value })}
          />
        </div>
        <Button variant="contained" color="primary" onClick={handlePost}>create</Button>
      </form>
    </>
  )
}

export default CreateBlog