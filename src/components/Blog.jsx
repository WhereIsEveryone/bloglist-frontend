const Blog = ({ blog }) => (
  <div>
    {blog.title} | {blog.author} | Likes {blog.likes} | {blog.url}
  </div>  
)

export default Blog