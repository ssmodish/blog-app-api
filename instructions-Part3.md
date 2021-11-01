## Build React appearance

Now that we have a working API, let's build a small react app to interact with it.

```bash
npx create-react-app blog-app-front-end
```

Then we'll sketch out the components we'll need:

- login, logout, and register - We'll call this navbar
- a list of the users posts
  - a single post with a way to edit and delete it
- a form to create and/or edit a post

We'll edit our fresh React app by going to `/src/App.js` and replace everything in there with the following:

```javascript
function App() {
  return (
    <div>
      <div id='navbar'>
        <h1>Welcome to Grammerhub</h1>
        <div className='authorization'>
          <button>Login</button>
          <button>Register</button>
          <button>Logout</button>
        </div>
      </div>

      <div className='postList'>
        <ul>
          <div className='post'>
            <li>
              Post 1<button>Edit</button>
              <button>Delete</button>
            </li>
          </div>

          <li>Post 2</li>
          <li>Post 3</li>
        </ul>
      </div>

      <div className='form'>
        <form>
          <label for='name'>Name:</label>
          <input type='text' id='name' name='name' />
          <br />
          <label for='body'>Body:</label>
          <input type='text' id='body' name='body' />
          <br />
          <button>Submit</button>
        </form>
      </div>

      <div className='greeting'>
        <h2>Hello User!</h2>
      </div>
    </div>
  )
}

export default App
```

_`/src/App.js`_

Now we'll break this up into components.
Start by adding a directory

```bash
mkdir /src/components
```

Then we'll make files for the components

```bash
touch src/components/navbar.js
touch src/components/post-list.js
touch src/components/post.js
touch src/components/post-form.js
```

Now, for each `<div>` with a class name - create components that match those divs

```javascript
function Navbar() {
  return (
    <div id='navbar'>
      <h1>Welcome to Grammerhub</h1>
      <div className='authorization'>
        <button>Login</button>
        <button>Register</button>
        <button>Logout</button>
      </div>
    </div>
  )
}

export default Navbar
```

_`/src/components/navbar.js`_

```javascript
function Post() {
  return (
    <div className='post'>
      <li>
        Post 1<button>Edit</button>
        <button>Delete</button>
      </li>
    </div>
  )
}
export default Post
```

_`/src/components/post.js`_

```javascript
import Post from './post'
function PostList() {
  return (
    <div className='postList'>
      <ul>
        <Post />
        <Post />
        <Post />
      </ul>
    </div>
  )
}

export default PostList
```

_`/src/components/post-list.js`_

```javascript
function PostForm() {
  return (
    <div className='form'>
      <form>
        <label for='name'>Name:</label>
        <input type='text' id='name' name='name' />
        <br />
        <label for='body'>Body:</label>
        <input type='text' id='body' name='body' />
        <br />
        <button>Submit</button>
      </form>
    </div>
  )
}
export default PostForm
```

_`/src/components/post-form.js`_

Notice how we imported and used the Post component into the PostList
We'll now we will import and replace these sections in `App.js`.

```javascript
import Navbar from './components/navbar'
import PostForm from './components/post-form'
import PostList from './components/post-list'
function App() {
  return (
    <div>
      <Navbar />
      <PostList />
      <PostForm />
      <div className='greeting'>
        <h2>Hello User!</h2>
      </div>
    </div>
  )
}

export default App
```

_`/src/App.js`_

---

## Activate API Powers!

Now we're ready to connect to our api and pull some data.

Make sure you start the API we've built if it isn't already running.

Now, in _`/src/components/post-list.js`_ we need to add the following:

```javascript
import { useState, useEffect } from 'react'

function PostList() {
  const [postListData, setPostListData] = useState([])

  const fetchPostListData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/posts', { mode: 'cors' })
      const data = await response.json()
      console.log({ data })
      setPostListData(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchPostListData()
  }, [])

  return (
    <div className='postList'>
      <ul>
        {postListData.map((post) => (
          <li>Post: {post.post_title}</li>
        ))}
      </ul>
    </div>
  )
}

export default PostList
```

_`/src/components/post-list.js`_

So now we've:

- Added `postDataList` state to our component
- Created the `fetchPostListData` function which gets data from our database and sets our `postDataList` state
- Utilised the useEffect function to call our `fetchPostListData`
- Are mapping through this data to display information

We will now put this information into our Post component.

```javascript
import Post from './post'
...
  return (
    <div className='postList'>
      <ul>
        {postListData.map((post) => (
          <Post postData={post} key={post.post_id} />
        ))}
      </ul>
    </div>
  )
...
```

_`/src/components/post-list.js`_

And we'll update our post to accept the data and display it:

```javascript
function Post(props) {
  const { post_title, post_body } = props.postData
  return (
    <div className='post'>
      <li>
        <h2>{post_title}</h2>
        <p>{post_body}</p>
        <button>Edit</button>
        <button>Delete</button>
      </li>
    </div>
  )
}
export default Post
```

_`/src/components/post.js`_
