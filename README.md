# MYBLOG App

I'm creating this project along with step by step [instructions](https://climbing-wildcat-51a.notion.site/Make-a-Blog-App-using-Express-React-sqlite-and-Okta-a82ce7f530844f548c38a942ca18efe5) for use to guide/educate/entertain members of [Grammerhub](http://grammerhub.org/) during our weekly meetups.

It was inspired by [this project](https://scotch.io/tutorials/build-a-blog-using-expressjs-and-react-in-30-minutes) on Scotch.io.

The tech stack for this project includes Express, Knex, sqlite, and Okta OIDC.

The coresponding front end project for this API is located **[here](https://github.com/GrammerhubTeam/blog-app-front-end)**.

Step by step instructions with explainations are being formed:

- [Part 1 - Building an Express server from scratch](instructions-Part1.md)
- [Part 2 - Create a sqlite database and add routes](instructions-Part2.md)
- [Part 3 - Incorporating Okta OIDC and serving JWT's](instructions-Part3.md)

_*This is a work in progress. All contributions will be considered helpful.*_

---

## Quickstart

---

Add `.env` with `PORT=8080`
then:

```bash
npm i
npx knex migrate:latest
npx knex seed:run
npm run dev
```
