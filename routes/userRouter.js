require('dotenv').config()
const express = require('express')
const router = express.Router();
const con = require('../dbConnection')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
// const mysql = require('mysql2');



// REGISTER USER
router.post('/', async (req, res) => {
const { name, email, contact, password} = req.body
if (!name || !email || !contact || !password)
    res.status(400).send({ msg: "Not all fields have been selected"});

const salt = await bcrypt.genSalt()
const hashedPassword = await bcrypt.hash(password, salt)

  var sql = `INSERT INTO users (user_name, user_email, user_contact, user_password) VALUES ('${name}', '${email}', '${contact}', '${hashedPassword}')`;
  con.query(sql, function (err, result) {
    if (err) throw err; 
    console.log("1 record inserted");
    res.send("user created")
  });
});

// GET ALL USERS
router.get('/', (req, res) => {
    var sql = `SELECT * FROM users`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("All Users");
      res.send(result)
    });
  });
  
// GET BY ID  
router.get('/:id', (req, res) => {
  var sql = `SELECT * FROM users WHERE user_id=${req.params.id}`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Users selected");
    res.send(result)
  });
});

// SIGN IN USER
router.patch('/', async (req, res) => {
  const { email, password } = req.body;
  var sql = `SELECT * FROM users WHERE user_email='${email}'`;
  con
  .query(sql, async function (err, result) {
    const user = result[0];
    console.log(user)
    const match = await bcrypt.compare(password, user.user_password);
    if (match) {
      console.log(user);
      try {
        const access_token = jwt.sign(
          JSON.stringify(user),
          process.env.SECRET_KEY
        );
    res.json({ jwt: access_token });
    } catch (error) {
     console.log(error);
    }
  } else {
    res.send('email and password dont match');
  }
})
.on('error', () => {
    res.send('Could not fetch from database');
  });
});

// UPDATE USER WITH ID
router.put('/:id', (req, res) => {
  const { name, email, contact, password, avatar, about} = req.body

  let sql = "UPDATE users SET"

  if(name) sql += `user_name=${name},`
  if(email) sql += `user_email=${email},`
  if(contact) sql += `user_contact=${contact},`
  if(password) sql += `user_password=${password},`
  if(avatar) sql += `user_avatar=${avatar},`
  if(about) sql += `user_about=${about},`

  if(sql.endsWith(',')) sql = sql.substring(0, sql.length-1)

  sql += `WHERE user_id=${req.params.id}`

  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record Updates");
    res.send(result)
  });
});

// DELETE BY ID
router.delete('/:id', (req, res) => {
  var sql = `DELETE FROM users WHERE user_id=${req.params.id}`;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(" 1 record deleted");
    res.send(result)
  });
});








module.exports = router;
