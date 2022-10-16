_This is a continuation of [Create an API for a simple blog app - Part 1: Express Server](https://github.com/GrammerhubTeam/blog-app-api/blob/main/instructions-Part1.md)_

---

## Creating a Database

---

In development we'll use sqlite3, a very lightweight relational database management system. We'll also be using [Knex.js](https://knexjs.org/) to build, query, and connect to our sqlite database. We'll also should make a directory for this data.

```bash
npm i sqlite3 knex
mkdir data
```

We will also generate a configuration file:

```bash
npx knex init
```

This actually generates a file for three different environments, we'll edit the newly created `knexfile.js` down - we also have to add a line to prevent sqlite from crashing:

```javascript
// _`/knexfile.js`_
module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3',
    },
    useNullAsDefault: true,
  },
}
```

Now we'll make a db-config file in our data folder that we can utilize throughout our app when we need to connect to the database.

```javascript
// _`/data/db-config.js`_

const knex = require('knex')

const config = require('../knexfile.js')

const db = knex(config.development)

module.exports = db
```

Now we'll add our models file that communicates directly with our database

```bash
touch api/posts/posts.models.js
```

and start it with

```javascript
// _`/api/posts/posts.models.js`_

const db = require('../../data/db-config')

module.exports = {
  get,
  getById,
  create,
  update,
  remove
}
```

### Create a migration using Knex

Using Knex, migrations are the files used to setup the tables in our database. First we'll tell Knex where to save them by adding the following to the knexfile.

```javascript
// _`/knexfile.js`_

  migrations: {
    directory: './data/migrations',
  },
```

And now we'll run the following:

```bash
  npx knex migrate:make posts-schema
```

That should have created a `/data/migrations` directory and put a file _`<timestamp>_posts-schema.js`_ in that directory. Knex adds a timestamp because some tables might be dependent on others existing first.

Open up _`<timestamp>_posts-schema.js`_ and fill it out like so:

```javascript
// _`/data/migrations/<timestamp>_posts-schema.js`_

exports.up = function (knex) {
  return knex.schema.createTable('posts', (tbl) => {
    tbl.increments('post_id') // automatically increments a new number for each entry - this will be the Primary Key
    tbl.integer('user_id').notNullable() // this field is required
    tbl.text('post_title').unique().notNullable() // this field is both required and must be unique
    tbl.text('post_body')
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('posts') // this will delete the posts table if run
}
```

Then run

```bash
npx knex migrate:up
```

This should have created the database with the table specified in the knexfile, `/data/dev.db3` in this case. If you have sqlite studio or some other way of checking the structure you can see for yourself.

### _Add to git_

We probably shouldn't commit our database, so add the sqlite database file format to our `.gitignore` file.

```text
// _`.gitignore`_

*.db3
```

We should then be able to add all remaining files to our repo.

```bash
git add .
git commit -m 'add sqlite database and knex'
```

---

## Seed the database

---

Using Knex, seeds are the files used to fill our database with some data. First we'll tell Knex where to save the seeds by adding the following to the knexfile.

``` JSON
// _`/knexfile.js`_

  seeds: {
    directory: './data/seeds',
  },
```

Now we'll add a little default data to our database to give our endpoints something to return.

```bash
npx knex seed:make 01-posts
```

Once again this should have created a seeds folder in your data directory and a file, just `01-posts.js` this time though. We number these files ourselves so knex will run them in the order data must be entered

We need to edit this default file to match the data we expect in our table:

```javascript
// _`/data/seeds/01-posts.js`_

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('posts').truncate()
  await knex('posts').insert([
        {
          user_id: 1,
          post_title: 'test post 1',
          post_body:
            'Test post body 1',
        },
        { user_id: 1,
          post_title: 'test post 2',
          post_body:
            'Test post body 2'
        },
        {
          user_id: 2,
          post_title: 'test post 3',
          post_body:
            'Test post body 3',
        },
        {
          user_id: 2,
          post_title: 'test post 4',
          post_body:
            'Test post body 4',
        },
        { user_id: 3, post_title: 'test post 5' },
      ])
    })
}
```

Now we can seed our database with this example data by running the following:

```bash
npx knex seed:run
```

With these files set up, we can always revert our database to either be empty or include these basic seed files, which is great for testing purposes

### _Add to git_

```bash
git add .
git commit -m 'database seeded'
```

---

## Build our post routes and models

---

You might have already guessed that we will be keeping our database calls separated from our routes with this setup. Any database calls should be made in our models file and our routes should just call the methods we setup there. This should make it easy to maintain. If we ever decide to change over to a different database, if one supported by knex we need only change or add to the `knexfile`. Otherwise, we just need to adjust our models to work with whatever other database we choose.

```javascript
// _`api/posts/posts.router.js`_

const express = require('express')
const Posts = require('./posts.models')

const router = express.Router()

// * [READ] ALL of the posts
router.get('/', async (req, res) => {
  try {
    const data = await Posts.get() // expects an array of posts as data
    res.json(data)
  } catch (error) {
   res.send(error)
  }
})
// [READ] a post
router.get('/:id', async (req, res) => {
  const id = req.params.id
  const data = await Posts.getById(id) // expects a single post object as data
  res.json(data)
})
// [CREATE] a new post
router.post('/', async (req, res) => {
  const newPost = await Posts.create(req.body) // expects a single post object complete with new post_id
  res.status(201).json(newPost) 
})
// [UPDATE] the data in a post
router.put('/:id', async (req, res) => {
  const id = req.params.id
  const updatedPost = await Posts.update(id, req.body) // expects a single post object with updated data
  res.json(updatedPost)
})
// [DELETE] a post
router.delete('/:id', async (req, res) => {
  const deletedPost = await Posts.remove(req.params.id) // expects a single post object of the deleted post
  res.json(deletedPost)
})

module.exports = router
```

---

```javascript
// _`api/posts/posts.models.js`_


const db = require('../../data/db-config')

function get() {
  // return an array of posts
  return db('posts')
}

function getById(id) {
  // return a single post object
  return db('posts').where("post_id", id).first()
}

async function create({ user_id, post_title, post_body }) {
  // return a single post object that includes the new post_id
  const [id] = await db('posts').insert({ user_id, post_title, post_body })
  return getById(id)
}

async function update(id, { user_id, post_title, post_body }) {
  // return a single post object of updated post
  await db('posts').where("post_id", id).update({ user_id, post_title, post_body })
  return getById(id)
}

async function remove(id) {
  // return a single post object of deleted post
  const deletedPost = await getById(id)
  await db('posts').where("post_id", id).delete()
  return deletedPost
}

module.exports = {
  get,
  getById,
  create,
  update,
  remove
}
```

---
