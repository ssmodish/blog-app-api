const db = require('../../data/db-config')

function get() {
  return db('posts')
}

function getById(id) {
  return db('posts').where("post_id", id).first()
}

async function create({ user_id, post_title, post_body }) {
  const [id] = await db('posts').insert({ user_id, post_title, post_body })
  return getById(id)
}

async function update(id, { user_id, post_title, post_body }) {
  await db('posts').where("post_id", id).update({ user_id, post_title, post_body })
  return getById(id)
}

async function remove(id) {
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