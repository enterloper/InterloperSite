HEY! Thanks for your interest in this Repo! This repo consists of all that makes up my personal website which I'm treating as a sandbox to experiment with API construction, Database creation with PostgreSQL, jQuery, Express and Node. In addition, this site will also showcase blogs, and projects I've built independently as well as with groups. Built with Node, Express, jQuery, Handlebars, and SQL.

<------------------start DB server------------------>
postgres -D /usr/local/var/postgres

<------------------ establish DB------------------>
dropdb blogdb 
createdb blogdb

<------------------install schema------------------>
node server/schema.js

<------------------run seed data------------------>
(if you need to template a seed, run first command and populate)
knex seed:make shows_seed --env development 
(command below will populate with seeds in seeds dir)
knex seed:run knexfile.js

<------------------migrations----------------->
nex migrate:make blogs_toys

<------------------view data------------------>
psql blogdb <-then-> SELECT * FROM (table-name)
