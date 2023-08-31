import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState(null) 
  const [password, setPassword] = useState(null)
  const [user, setUser] = useState(null)
  const [newTitle, setNewTitle] = useState(null)
  const [newAuthor, setNewAuthor] = useState(null)
  const [newUrl, setNewUrl] = useState(null)
  const [notificationMsg, setNotificationMsg] = useState({message: null, success: null})

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      setUser(user)
      blogService.setToken(user.token)
      setUsername(null)
      setPassword(null)
      setNotificationMsg( {message: `Henkilö ${user.name} kirjattu sisään`, success: true} )
      timeOut()
    } catch (exception) {
        setNotificationMsg( {message: `Väärä käyttäjätunnus ja/tai salasana`, success: false} )
        timeOut()
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

  const blogForm = (handleSubmit) => {
    return (
        <form style={{marginTop: 20}} onSubmit={handleSubmit}>
          <div>
            Title: <input value={newTitle} onChange={({ target }) => setNewTitle(target.value)} /> <br />
            Author: <input value={newAuthor} onChange={({ target }) => setNewAuthor(target.value)} /> <br />
            Url: <input value={newUrl} onChange={({ target }) => setNewUrl(target.value)} /> <br />
            <button type="submit">Lisää</button>
          </div>
        </form>
    )
  }

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }
    blogService
        .create(blogObject)
        .then(returnedBlog => {
          setBlogs(blogs.concat(returnedBlog))
          setNewTitle(null)
          setNewAuthor(null)
          setNewUrl(null)
          setNotificationMsg( {message: `Blogin ${newTitle} lisäys onnistui`, success: true} )
          timeOut()
        })
        .catch(error => {
          console.log(error.response.data.error)
          setNotificationMsg( {message: error.response.data.error, success: false} )
          timeOut()
        })
  }

  const showBlogs = () => {
    return (
      blogs.map(blog =>
        {
          console.log(blog)
          return <Blog key={blog.id} blog={blog} />
        }
    )
  )}

  const logoutButton = (handleClick) => (
    <button onClick={handleClick}>Logout</button>
  )

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const timeOut = () => {
    setTimeout(() => {
      setNotificationMsg( {message: null, success: null} )
    }, 5000)
  }

  return (
    <div>
      <Notification notification={notificationMsg}/>
      {!user && 
        <div>
          <h2>Log in to blog app</h2>
          {loginForm()}
        </div>  
      }
      {user && 
        <div>
          <p>
            {user.name} logged in {logoutButton(handleLogout)}
          </p>
          <div>
            <h2>Blogs</h2>
            {showBlogs()}
            {blogForm(addBlog)}
          </div>
        </div>
      }
    </div>
  )
}

export default App