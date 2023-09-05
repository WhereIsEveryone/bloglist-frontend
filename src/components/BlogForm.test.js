import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('callback function gets the right data', async () => {
  const user = userEvent.setup()
  const createBlog = jest.fn()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('Otsikko')
  const authorInput = screen.getByPlaceholderText('Kirjoittaja')
  const urlInput = screen.getByPlaceholderText('Url')

  const sendButton = screen.getByText('Lisää')

  await user.type(titleInput, 'Blog title')
  await user.type(authorInput, 'Blog author')
  await user.type(urlInput, 'https://a-blog.com')
  
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)

  expect(createBlog.mock.calls[0][0].title).toBe('Blog title')
  expect(createBlog.mock.calls[0][0].author).toBe('Blog author')
  expect(createBlog.mock.calls[0][0].url).toBe('https://a-blog.com')
})