const express = require('express')
const router = express.Router();
const con = require('../dbConnection')
const authenticateToken = require('../auth.js')

function getToday() {
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    const yyyy = today.getFullYear();
  
    today = yyyy + "/" + mm + "/" + dd ;
  
    return today;
  }

router.get('/',authenticateToken, (req, res) => {
    var sql = `SELECT * FROM posts`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("All Users");
      res.send(result)
    })
    .on('error', () => res.sendStatus(500));
  });

router.post('/', authenticateToken, (req, res, next) => {
    const { title, body} = req.body
    if (!title || !body) res.sendStatus(400);
    const user = req.user;
    
      var sql = `INSERT INTO posts (post_title, post_body, post_date, post_author) VALUES ('${title}', '${body}', '${getToday()}', '${user.user_id}')`;
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log('1 record inserted');
        res.send({ msg: "Post Created"});
    });
});


router.get('/:id', authenticateToken, (req, res) => {
    var sql = `SELECT * FROM posts WHERE posts_id=${req.params.id}`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Posts selected");
      res.send(result)
    });
})


router.put('/:id', authenticateToken, (req, res) => {
    const { title, body} = req.body
  
    let sql = `UPDATE posts SET `
  
    if(title) sql += `post_title= '${title}',`
    if(body) sql += `post_body= '${body}',`
  
    if(sql.endsWith(',')) sql = sql.substring(0, sql.length-1)
  
    sql += ` WHERE posts_id=${req.params.id}`
  
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record Updates");
      res.send(result)
    });
  });


router.delete('/:id', authenticateToken, (req, res) => {
    var sql = `DELETE FROM posts WHERE posts_id=${req.params.id}`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log(" 1 record deleted");
      res.send(result)
    });
  });

  module.exports = router;