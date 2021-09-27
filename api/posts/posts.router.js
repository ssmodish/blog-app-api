const express = require('express')
const Posts = require('./posts.models')

const router = express.Router()

// * [READ] ALL of the posts
router.get('/', async (req, res) => {
  try {
    const data = await Posts.get()
    res.json(data)
  } catch (error) {
   res.send(error)
  }
})
// [READ] a post
router.get('/:id', async (req, res) => {
  const id = req.params.id
  const data = await Posts.getById(id)
  res.json(data)
})
// [CREATE] a new post
router.post('/', async (req, res) => {
  const newPost = await Posts.create(req.body)
  res.status(201).json(newPost)
})
// [UPDATE] the data in a post
router.put('/:id', async (req, res) => {
  const id = req.params.id
  const updatedPost = await Posts.update(id, req.body)
  res.json(updatedPost)
})
// [DELETE] a post
router.delete('/:id', async (req, res) => {
  const deletedPost = await Posts.remove(req.params.id)
  res.json(deletedPost)
})

module.exports = router
