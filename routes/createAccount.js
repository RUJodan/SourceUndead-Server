import bcrypt from 'bcryptjs';
import query from '../db';

async function createAccount(user, pass, email) {
  // check if username already exists
  const check = 'SELECT COUNT(username) AS count FROM players WHERE username=$1';
  let params = [user];
  const data = await query(check, params);
  if (Number(data.rows[0].count)) {
    return {
      msg: 'This username has been taken',
      flag: true,
    };
  }
  // hash password with bcrypt and store account in db
  const password = await bcrypt.hash(pass, 10);
  const sql = 'INSERT INTO players (username, email, password) VALUES ($1, $2, $3)';
  params = [user, email, password];

  await query(sql, params);

  return {
    msg: 'Your account was created! You will be redirected to the login page in 2 seconds',
    flag: false,
  };
}

/*
  Routing for /create
  /get: render createAccount form
  /post: @username @password @email params
    - Post user input to createAccount form, check for existing username
    - If user exists, reject request and send error back
    - Create the user account
 */
export default async function wsCreateAccount(payload, io) {
  // destructure form body into constants
  const { username, password, email } = payload;
  if (!username || !password || !email) {
    io.emit('create-account', {
      msg: 'Please fill out all form fields',
      flag: true,
    });
    return;
  }
  const response = await createAccount(username, password, email);

  // create/reject account, send to user
  io.emit('create-account', response);
}
