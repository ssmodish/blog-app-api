const express = require('express')
const db = require('../../data/db-config')

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
