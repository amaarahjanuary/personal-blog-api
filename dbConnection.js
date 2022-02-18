const mysql = require('mysql2')

const con = mysql.createConnection({
  host: "localhost",
  user: "amaarah2021",
  password: "@Lifechoices2021",
  database: "personal_blog"
});


module.exports = con;