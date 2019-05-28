import express from 'express';
import bcrypt from 'bcryptjs';
import query from '../db';

const router = express.Router();

// log user into dashboard
async function login(user) {
  // check for player existance
  const sql = 'SELECT id, username, password FROM players WHERE username = $1';
  const params = [user];
  const data = await query(sql, params);

  console.log(data.rows);

  // if results, return them, otherwise return false (non existing account)
  if (!data.rows.length) return false;
  return data.rows;
}

/*
  Routing for /login
  /get: render login form
  /post: @username @password params
    - Post user input to login form, retrieve player
    - If user exists, check password for validity, then create session
    - Reject if account does not exist or password is wrong
 */
router.route('/')
  .post(async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.json({
        msg: 'Please fill out all form fields',
        flag: true,
      });
    }

    const user = await login(username);
    const response = {
      flag: true,
      msg: '',
    };

    console.log(user);

    // fetch player details
    if (!user) {
      response.msg = 'Your username/password is incorrect';
      return res.json(response);
    }

    // compare to password hash
    const bool = await bcrypt.compare(password, user[0].password);

    if (bool) {
      response.msg = 'You have logged in';
      response.flag = false;
    } else {
      // reject, password is wrong
      response.msg = 'Your username/password is incorrect';
      response.flag = true;
    }

    return res.json(response);
  });

export default router;
