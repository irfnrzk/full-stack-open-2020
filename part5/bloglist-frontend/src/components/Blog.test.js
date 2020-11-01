import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import Blog from './Blog'

test(`checks <Blog /> by default renders title & author without url & number of likes`, () => {
  const blog = {
    author: 'Michael Chan',
    id: '5f9d2abb314d084db48decf5',
    likes: 20,
    title: 'React patterns',
    url: 'https://reactpatterns.com/',
    user: {
      id: '5f9d02cad213823b143d5049',
      name: 'Michael Chan',
      username: 'Michael'
    }
  }

  const component = render(
    <Blog
      key={blog.id}
      blog={blog}
      username={'Michael'}
    />
  )

  expect(component.container).toHaveTextContent(
    'React patterns'
  )

  expect(component.container).toHaveTextContent(
    'Michael Chan'
  )

  expect(component.container.querySelector('div + div')).toHaveClass(
    'd-none'
  )
})

test(`checks blog's url & likes shows when view button is clicked`, () => {
  const blog = {
    author: 'Michael Chan',
    id: '5f9d2abb314d084db48decf5',
    likes: 20,
    title: 'React patterns',
    url: 'https://reactpatterns.com/',
    user: {
      id: '5f9d02cad213823b143d5049',
      name: 'Michael Chan',
      username: 'Michael'
    }
  }

  const mockHandler = jest.fn()

  const component = render(
    <Blog
      key={blog.id}
      blog={blog}
      username={'Michael'}
      toggleView={mockHandler}
    />
  )

  const button = component.getByText('view')
  fireEvent.click(button)

  // const div = component.container.querySelector('div')
  // console.log(prettyDOM(div))

  expect(component.container.querySelector('div + div')).not.toHaveClass(
    'd-none'
  )
})

test(`ensures the event handler <Blog /> received as props is called twice when like button is clicked twice`, () => {
  const blog = {
    author: 'Michael Chan',
    id: '5f9d2abb314d084db48decf5',
    likes: 20,
    title: 'React patterns',
    url: 'https://reactpatterns.com/',
    user: {
      id: '5f9d02cad213823b143d5049',
      name: 'Michael Chan',
      username: 'Michael'
    }
  }

  const addLike = jest.fn()

  const component = render(
    <Blog
      key={blog.id}
      blog={blog}
      username={'Michael'}
      addLike={addLike}
    />
  )

  const likeButton = component.getByText('like')
  fireEvent.click(likeButton)
  fireEvent.click(likeButton)

  expect(addLike.mock.calls).toHaveLength(2)
})