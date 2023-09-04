const Notification = ({ notification }) => {
  if (notification.message === null) {
    return null
  }

  const notificationStyle = {
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 4,
    padding: 10,
    marginBottom: 10
  }
  const successStyle = { ...notificationStyle, color: 'green' }
  const errorStyle = { ...notificationStyle, color: 'red' }
  const style = notification.success ? successStyle : errorStyle

  return (
    <div style={style}>
      {notification.message}
    </div>
  )
}

export default Notification