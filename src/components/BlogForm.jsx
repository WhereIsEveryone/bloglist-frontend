import { useState } from 'react'

const BlogForm = ( {createBlog} ) => {
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
        <form style={{marginTop: 20}} onSubmit={addBlog}>
          <div>
            Title: <input value={newTitle} onChange={({ target }) => setNewTitle(target.value)} /> <br />
            Author: <input value={newAuthor} onChange={({ target }) => setNewAuthor(target.value)} /> <br />
            Url: <input value={newUrl} onChange={({ target }) => setNewUrl(target.value)} /> <br />
            <button type="submit">Lisää</button>
          </div>
        </form>
    )
  }

  export default BlogForm