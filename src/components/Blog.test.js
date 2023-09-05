import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

const blog = {
    title: 'Blog title',
    author: 'Blog author',
    likes: 10,
    url: 'https://a-blog.com'
  }

test('renders title', async () => {

  render(<Blog blog={blog} />)

  const element = screen.getByText('Blog title')

  expect(element).toBeDefined()
})

test('renders full info', async () => {
  
    render(<Blog blog={blog} />)

    const user = userEvent.setup()
    const button = screen.getByText('Laajenna')
    await user.click(button)
  
    screen.getByText(blog.title, { exact: false })
    screen.getByText(blog.author, { exact: false })
    screen.getByText(`Likes ${blog.likes}`, { exact: false })
    screen.getByText(blog.url, { exact: false })

})

test('two likes can increase likes by 2', async () => {
  
    const mockHandler = jest.fn()

    render(<Blog blog={blog} updater={mockHandler}/>)

    const user = userEvent.setup()
    const button = screen.getByText('Laajenna')
    await user.click(button)
    const likeButton = screen.getByText('Tykkää')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)

})