import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.get(baseUrl, config)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async updateObject => {
  const config = {
    headers: { Authorization: token },
  }

  const id = updateObject.id
  delete updateObject.id

  const response = await axios.put(`${baseUrl}/${id}`, updateObject, config)
  return response.data
}

export default {
  getAll,
  setToken,
  create,
  update
}