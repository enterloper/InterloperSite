HEY! Thanks for your interest in this Repo! This repo consists of all my personal website I'm treating as a sandbox to experiment with API construction, Database creation with PostgreSQL, jQuery, and Node. In addition, this site will also showcase blogs, and projects I've built independently as well as with groups. Built with Node, Express, jQuery, Handlebars, and SQL.

<------------------start DB server------------------>
postgres -D /usr/local/var/postgres

<------------------ establish DB------------------>
dropdb blogdb 
createdb blogdb

<------------------install schema------------------>
node server/schema.js

<------------------run seed data------------------>
knex seed:run knexfile.js

<------------------view data------------------>
psql blogdb <-then-> SELECT * FROM (table-name)
