_We were looking for a simple tutorial to follow for our weekly meetings and picked one last minute. It ended up being very outdated, so I've created this as an update and also an expansion to [that original tutorial](https://scotch.io/tutorials/build-a-blog-using-expressjs-and-react-in-30-minutes)._

_We assume you have a web browser, node, npm, and git installed as well as a bash shell. We also hope you have some sort of api testing tool installed like Postman, Insomnia, or httpie._

_If you already completed this part you can skip to [Part 2](https://dev.to/ssmodish/create-an-api-for-a-simple-blog-app-part-2-16kh-temp-slug-29197?preview=9aac60d0637abca4c3b2331f1231e2f89ab10fbf07d50627b16b76f196270d3bb0e11bc0e9b9b7f2babe33900d9bf0f75a213aba776dcdb6322eda3c)_

---

## Step 1: Setup Express

---

Create a project folder and basic setup by doing the following:

```bash
mkdir myblog
cd myblog
npm init -y
```

---

### _If you didn't pull this code from GitHub_

Now is the best time to initialize git! Pay attention to the status between every other git command.

```bash
git init
git status
git add .
git status
git commit -m "init commit"
git status
```

---

- You should now see `package.json` as a file in your folder.

We'll make 2 new files:

```bash
touch index.js
touch .env
```

Now you'll install some npm modules that you'll need for this app:

```bash
npm i express cors dotenv
npm i -D nodemon
```

**express** is a framework for building API's and web applications

**cors** handles cross origin requests

More documentation on these is available at [Expressjs.com](https://expressjs.com/)

**dotenv** loads the `.env` into system variables - used to keep them secret

**nodemon** restarts the server when it detects changes in our code files so we don't have to.

- The `-D` in this command saves this as a dev dependency - it won't be used when the server is eventually deployed

---

### Now for some code!

Open the `.env` file and add the following:

```title=".env"
PORT=8080
```

Now we'll build `index.js` into a basic express server

```javascript title="index.js"
// index.js

require('dotenv').config()
const express = require('express')

const server = express()

server.get('/hello', (req, res) => {
  res.json({ message: 'Hello from the Server' })
})

server.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}!`))
```

Replace scripts in `package.json` to easily run your server

```json title="package.json"
// package.json

...
"scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
...
```

---

### Make sure it's working

Type in `npm run dev` in your terminal - if there are no errors it's working!
In your browser - go to `localhost:8080/hello`, you should see something like this:
![image](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/lv45fqln64hkyoddku9o.png)

## Congratulations - you just build a web server!

---

### _Now seems like a great time to commit to git.... BUT WAIT!_

We'll take the help of using a preconfigured `.gitignore` file so we don't commit thousands of files **and our secrets** to our repo.

```bash
npx gitignore node
```

NOW it's safe to commit our files

```bash
git add .
git commit -m "first working server"
```

---

## Step 2: Setup eslint (optional)

---

We'll setup eslint to help us know if our code's syntax is broken

To install eslint:

```bash
npx eslint --init
```

Now it will ask us a few questions - for this project, using arrow keys and the space bar, we'll answer them as follows :

<table>
  <tr>
    <td>How would you like to use ESLint?</td>
    <td>To check syntax and find problems</td>
  </tr>
  <tr>
    <td>What type of modules does your project use?</td>
    <td>CommonJS (require/exports)</td>
  </tr>
  <tr>
    <td>Which framework does your project use?</td>
    <td>None of these</td>
  </tr>
  <tr>
    <td>Does your project use TypeScript?</td>
    <td>No</td>
  </tr>
  <tr>
    <td>Where does your code run?</td>
    <td>node only</td>
  </tr>
  <tr>
    <td>What format do you want your config file to be in?</td>
    <td>JSON</td>
  </tr>
  <tr>
    <td>Would you like to install them now with npm?</td>
    <td>Yes</td>
  </tr>
</table>

This should have created a file called `.eslintrc.json` with the following contents:

```json title=".eslint.json"
// .eslint.json

{
  "env": {
    "commonjs": true,
    "es2021": true,
    "node": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 12
  },
  "rules": {}
}
```

It should have also added an `eslint` entry in your `package.json` under `devDependencies`

---

### _Time to commit to git!_

Every time we complete a step is a good time to commit

```bash
git add .
git commit -m 'added eslint'
```

---

## Step 3: Separation of Concerns I: Building an API

---

We should try to maintain "separation of concerns" while we build this app. In order to do that we need to determine what those concerns are.

The first step a server needs to do is listen for connections, so we'll make that the sole concern of `index.js` and create a separate `server.js` file to handle those connections.

```bash
mkdir api
touch api/server.js
```

Now cut everything but the `server.listen` line out of `index.js` and paste it into `server.js`

At the top of `index.js` add the line

```javascript title="index.js"
// index.js

const server = require('./api/server')
```

and at the bottom of `server.js` add the line

```javascript title="/api/server.js"
// /api/server.js

module.exports = server
```

With that complete, our server should be working again. Test by going to [localhost:8080/hello](http://localhost:8080/hello) in your browser - or even better Postman - and you should get the welcome message again.

---

### _Time to commit again!_

```bash
git add .
git commit -m 'separate server into api directory'
```

---

## Step 4: The Very Basic Anatomy of an Express app

---

Express apps generally follow a pattern - our `server.js` file is already checking off a number of the boxes.

```javascript title="/api/server.js"
// /api/server.js

// Import dependancies
// - brings in all of the modules we'll be using
require('dotenv').config()
const express = require('express')
const cors = require('cors')

// Create an instance of an express app
// - create the actual server object
const server = express()

// Connect the app to global middleware
// - functions that every endpoint passes through
server.use(cors())
server.use(express.json())

// Endpoints check connection and perform functions
// - the code that sends and receives messages and determines what to do
server.get('/hello', (req, res) => {
  res.json({ message: 'Hello from the Server' })
})

// Listen to or export server
// - what the rest of the world connects to
module.exports = server
```

---

## Step 5: Separation of Concerns II: Routing Endpoints

---

C.R.U.D is an acronym for:

- **C**reate
- **R**ead
- **U**pdate
- **D**elete

Let's make a posts folder in the api directory and `posts.router.js` file inside of that

Add some comments

```javascript title="/api/posts/posts.router.js"
// /api/posts/posts.router.js

// [CREATE] a new post
// [READ] ALL of the posts
// [READ] a single post
// [UPDATE] the data in a post
// [DELETE] a post
```

These roughly translate to http protocol methods and SQL commands

```
-------- → - HTTP - → - SQL -
[CREATE] → [POST]   → [INSERT]
[READ]   → [GET]    → [SELECT]
[UPDATE] → [PUT]    → [UPDATE]
[DELETE] → [DELETE] → [DELETE]
```

### Why do we want to know this?

Our server will eventually communicate with our database using http methods and if our database is SQL based we'll need to know a little about SQL even with an ORM.

ORM stands for "Object-relational mapping" and it is a piece of software that stands between your app and database. Often different databases are used to develop with vs production, an ORM lets you write code once and then it will translate to the specific database's flavor of SQL.

---

The other thing we need to know a little about is the http protocol. In order to ask for data or send data we need to know where and how that data should be sent.

# TODO: _Talk about request and response_

Since this will be part of our express server, we have to import it by adding `const express = require('express')` at the top of our file. Unlike the server, we are creating a endpoints on a route, so we will inform express by typing `const router = express.Router()` on the next line.

Now we'll put in some endpoints:

```javascript title="/api/posts/posts.router.js"
// /api/posts/posts.router.js

const express = require('express')
const router = express.Router()

// [CREATE] a new post
router.post('/', (req, res) => {
  res.json({ message: 'Creating a new post' })
})
// [READ] a post
router.get('/:id', (req, res) => {
  const id = req.params.id
  res.json({ message: `Getting post with id: ${id}` })
})
// [UPDATE] the data in a post
router.put('/:id', (req, res) => {
  const id = req.params.id
  res.json({ message: `Updated post with id: ${id}` })
})
// [DELETE] a post
router.delete('/:id', (req, res) => {
  const id = req.params.id
  res.json({ message: `Deleting post with id: ${id}` })
})
// * [READ] ALL of the posts
router.get('/', (req, res) => {
  res.json({ message: 'Getting all posts' })
})

module.exports = router
```

And then import it into our server

```javascript title="/api/server.js"
// /api/server.js

// Import dependencies
// - brings in all of the modules we'll be using
require('dotenv').config()
const cors = require('cors')

const postsRouter = require('./posts/posts.router')

const express = require('express')

// Create and instance of an express app
// - create the actual server object
const server = express()

// Connect the app to global middleware
// - functions that every endpoint passes through
server.use(cors())
server.use(express.json())

// Endpoints check connection and perform functions
// - the code that sends and receives messages and determines what to do
server.use('/api/posts', postsRouter)

server.get('/hello', (req, res) => {
  res.json({ message: 'Hello from the Server' })
})

// Listen to or export server
// - what the rest of the world connects to
module.exports = server
```

# _TODO: POSTMAN TESTS_

---

## Commit to git

```bash
git add .
git commit -m 'Add endpoints'
```

---

## Add your project to GitHub

Go to your repositories on GitHub and click on **New**
Name your repository (I've named mine _blog-app-api_) and add a description if you'd like.
Choose if you want your project to be Public or Private and then create repository.

### Make sure you DON'T add anything else as it will complicate the next part.

GitHub Should have popped up some instructions that we'll go ahead and follow:

```bash
git remote add origin <Link to your repo>
git branch -M main
git push -u origin main
```

That should have pushed your code!
See you in [Part 2](https://github.com/GrammerhubTeam/blog-app-api/edit/main/instructions-Part2.md)

---
