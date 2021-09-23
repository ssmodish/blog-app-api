_This is a continuation of [Create an API for a simple blog app - Part 1: Express Server](https://dev.to/ssmodish/create-an-api-for-a-simple-blog-app-part-1-5h1j-temp-slug-7718635?preview=b8b87e0b26081bfe5d5268419bc4d42b0d6cbc85d24224e08b425a2a946cfa80a0b070eae7260ef6e47d6fdb59c00636377f60d6aa326752e58b953b)_

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

_`/knexfile.js`_

Now we'll make a db-config file in our data folder that we can utilize throughout our app when we need to connect to the database.

```javascript
const knex = require('knex')

const config = require('../knexfile.js')

const db = knex(config.development)

module.exports = db
```

_`/data/db-config.js`_

Now we'll add that to the router where we'll soon use it. The beginning of `/api/posts/posts.router.js` should look like this:

```javascript
const express = require('express')
const db = require('../../data/db-config')

const router = express.Router()
```

_`/api/posts/posts.router.js`_

### Create a migration using Knex

Using Knex, migrations are the files used to setup our database. First we'll tell Knex where to save them by adding the following to the knexfile.

```javascript
  migrations: {
    directory: './data/migrations',
  },
```

_`/knexfile.js`_

And now we'll run the following:

```bash
  npx knex migrate:make posts-schema
```

That should have created a `/data/migrations` directory and put a file _`<numbers>_posts-schema.js`_ in that directory.

Open up _`<numbers>_posts-schema.js`_ and fill it out like so:

```javascript
exports.up = function (knex) {
  return knex.schema.createTable('posts', (tbl) => {
    tbl.increments('post_id') // automatically increments a new number for each entry - this will be the Primary Key
    tbl.text('user_id').notNullable() // this field is required
    tbl.text('post_title').unique().notNullable() // this field is both required and must be unique
    tbl.text('post_body')
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('posts') // this will delete the posts table if run
}
```

_`/data/migrations/<timestamp>_posts-schema.js`_

Then run

```bash
npx knex migrate:up
```

This should have created the database with the table specified in the knexfile, `/data/dev.db3` in this case.

### _Add to git_

We probably shouldn't commit our database, so add the sqlite database file format to our `.gitignore` file.

```text
*.db3
```

_`.gitignore`_

We should then be able to add all remaining files to our repo.

```bash
git add .
git commit -m 'add sqlite database and knex'
```

---

## Seed the database

---

Using Knex, seeds are the files used to fill our database with some data. First we'll tell Knex where to save the seeds by adding the following to the knexfile.

```
  seeds: {
    directory: './data/seeds',
  },
```

_`/knexfile.js`_

Now we'll add a little default data to our database to give our endpoints something to return.

```bash
npx knex seed:make 01-posts
```

Once again this should have created a seeds folder in your data directory and a file, just `01-posts.js` this time though.

We need to edit this default file to match the data we expect in our table:

```javascript
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('posts').truncate()
  await knex('posts').insert([
        {
          user_id: 'user_1',
          post_title: 'test post 1',
          post_body:
            'Test post body 1',
        },
        { user_id: 'user_1',
          post_title: 'test post 2',
          post_body:
            'Test post body 2'
        },
        {
          user_id: 'user_2',
          post_title: 'test post 3',
          post_body:
            'Test post body 3',
        },
        {
          user_id: 'user_2',
          post_title: 'test post 4',
          post_body:
            'Test post body 4',
        },
        { user_id: 'user_3', post_title: 'test post 5' },
      ])
    })
}
```

_`/data/seeds/01-posts.js`_

### _Add to git_

```bash
git add .
git commit -m 'database seeded'
```

---
