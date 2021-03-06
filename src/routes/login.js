import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import secret from '../../key';
import query from '../database/db';

// log user into dashboard
async function login(user) {
  // check for player existance
  const sql = 'SELECT id, username, password FROM players WHERE username = $1';
  const params = [user];
  const data = await query(sql, params);

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
export default async function wsLogin(payload, io) {
  const { username, password } = payload;
  if (!username || !password) {
    io.emit('login', {
      msg: 'Please fill out all form fields',
      flag: true,
    });
    return;
  }

  const user = await login(username);
  const response = {
    flag: true,
    msg: '',
  };

  // fetch player details
  if (user === false) {
    response.msg = 'Your username/password is incorrect';
    response.flag = true;
    io.emit('login', response);
    return;
  }

  // compare to password hash
  const bool = await bcrypt.compare(password, user[0].password);

  if (bool) {
    const token = jwt.sign(user[0], secret.key);
    response.msg = 'You have logged in';
    response.flag = false;
    response.token = token;
  } else {
    // reject, password is wrong
    response.msg = 'Your username/password is incorrect';
    response.flag = true;
  }

  io.emit('login', response);
}
