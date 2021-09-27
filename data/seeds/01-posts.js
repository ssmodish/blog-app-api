exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('posts').truncate()
  await knex('posts').insert([
    {
      user_id: 1,
      post_title: 'test post 1',
      post_body: 'Test post body 1',
    },
    { user_id: 1, post_title: 'test post 2', post_body: 'Test post body 2' },
    {
      user_id: 2,
      post_title: 'test post 3',
      post_body: 'Test post body 3',
    },
    {
      user_id: 2,
      post_title: 'test post 4',
      post_body: 'Test post body 4',
    },
    { user_id: 3, post_title: 'test post 5' },
  ])
}
