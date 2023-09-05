import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ( { createBlog } ) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }
    createBlog(blogObject)
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <form style={{ marginTop: 20 }} onSubmit={addBlog}>
      <div>
            Title: <input value={newTitle} onChange={({ target }) => setNewTitle(target.value)} placeholder='Otsikko' /> <br />
            Author: <input value={newAuthor} onChange={({ target }) => setNewAuthor(target.value)} placeholder='Kirjoittaja' /> <br />
            Url: <input value={newUrl} onChange={({ target }) => setNewUrl(target.value)} placeholder='Url' /> <br />
        <button type="submit">Lisää</button>
      </div>
    </form>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm