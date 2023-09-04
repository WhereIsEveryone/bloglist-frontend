import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, user, updater, remover }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    paddingRight: 5,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [showAll, setShowAll] = useState(false)

  const updateBlog = () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    updater(blog.id, updatedBlog)
  }

  const removeBlog = () => {
    if (window.confirm(`Poista ${blog.title}?`)) {
      remover(blog.id)
    }
  }

  if (!showAll) {
    return (
      <div style={blogStyle}>
        {blog.title} <button onClick={() => setShowAll(true)}>Laajenna</button>
      </div>
    )
  }
  else {
    return (
      <div style={blogStyle}>
        {blog.title} <button onClick={() => setShowAll(false)}>Piilota</button> <br />
        {blog.author} <br />
        Likes {blog.likes} <button onClick={updateBlog}>Tykkää</button> <br />
        {blog.url} <br />
        {blog.user ? blog.user.name : 'Tuntematon'} <br />
        {blog.user && blog.user.name === user.name && <button onClick={removeBlog}>Poista</button> }
      </div>
    )
  }
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  updater: PropTypes.func.isRequired,
  remover: PropTypes.func.isRequired
}

export default Blog