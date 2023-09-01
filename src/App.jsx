import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
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
      setUsername('')
      setPassword('')
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

  const addBlog = (blogObject) => {
    blogService
        .create(blogObject)
        .then(returnedBlog => {
          setBlogs(blogs.concat(returnedBlog))
          setNotificationMsg( {message: `Blogin lisäys onnistui`, success: true} )
          timeOut()
        })
        .catch(error => {
          console.log(error.response.data.error)
          setNotificationMsg( {message: error.response.data.error, success: false} )
          timeOut()
        })
  }

  const updateBlog = (id, blogObject) => {
    blogService
      .update(id, blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.map(b => b.id !== id ? b : returnedBlog))
      })
      .catch(error => {
        setBlogs(blogs.filter(blog => blog.id !== id))
        setNotificationMsg( {message: `Blogia ei enää löydy palvelimelta`, success: false} )
        timeOut()
      })
  }

  const deleteBlog = (id) => {
    blogService
      .del(id)
      .then(() => {
        setBlogs(blogs.filter(blog => blog.id !== id))
        setNotificationMsg( {message: `Blogi poistettu`, success: true} )
        timeOut()
      })
      .catch(error => {
        setBlogs(blogs.filter(blog => blog.id !== id))
        setNotificationMsg( {message: `Blogi on jo poistettu palvelimelta`, success: false} )
        timeOut()
      })
  }

  const showBlogs = () => {
    blogs.sort( (a, b) => a.likes >= b.likes ? -1 : 1 )
    return (
      blogs.map(blog =>
        {
          return <Blog key={blog.id} blog={blog} user={user} updater={updateBlog} remover={deleteBlog}/>
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
            <Togglable buttonLabel="Luo uusi blogitieto" >
              <BlogForm createBlog={addBlog} />
            </Togglable>
          </div>
        </div>
      }
    </div>
  )
}

export default App