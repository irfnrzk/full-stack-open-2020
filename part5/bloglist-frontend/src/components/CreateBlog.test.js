import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import CreateBlog from './CreateBlog'

test(`checks <CreateBlog /> calls the event handler it received as props with the right details`, () => {
  const addBlog = jest.fn()

  const component = render(
    <CreateBlog createBlog={addBlog} />
  )

  const input = component.container.querySelector('input[name="author"]')
  const form = component.container.querySelector('form')

  fireEvent.change(input, {
    target: { value: 'Michael' }
  })
  fireEvent.submit(form)

  expect(addBlog.mock.calls[0][0].author).toBe('Michael')
})