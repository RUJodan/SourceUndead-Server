import express from 'express';
import redis from 'redis';
import logger from 'winston';
import socketIO from 'socket.io';
import jwt from 'jsonwebtoken';

// import jwt secret key
import secret from '../key';

// GET/POST routing (JSX templates, POST functions)
import wsCreateAccount from './routes/createAccount';
import wsLogin from './routes/login';

// configure winston logging
const log = logger.createLogger({
  level: 'info',
  format: logger.format.json(),
  transports: [
    new logger.transports.Console(),
    new logger.transports.File({ filename: 'sourceundead.log' }),
  ],
});

const app = express();

// allow cross origin requests

// create redis handler
// MAKE SURE REDIS IS RUNNING THIS TIME, YOU ASSJACK
const client = redis.createClient(6379, 'localhost');

// create the server
const server = app.listen(8080, () => {
  const { port } = server.address();
  log.info(`SourceUndead has risen from the grave on port ${port}`);
});

const io = socketIO.listen(server);

io.sockets.on('connection', (socket) => {
  socket.on('authenticate', ({ token }) => {
    // check the auth data sent by the client
    jwt.verify(token, secret.key, (err, decoded) => {
      if (err) {
        socket.authenticated = false;
        log.warn(`Unauthenticated: ${err}`);
      } else {
        // store the decoded token
        socket.authenticated = true;
        socket.decoded = decoded;
        log.info(`Socket user authenticated: ${token}`);
      }
    });
  });

  log.info('Websocket connection established');

  // let the client know we are not authenticated
  if (socket.authenticated === false) {
    io.emit('unauthenticated');
  }

  // let the client know if the route requested is authorized
  socket.on('authRoute', () => {
    if (socket.authenticated) {
      io.emit('authenticated');
    } else {
      io.emit('unauthenticated');
    }
  });

  // remove an existing authorized connection
  socket.on('removeAuthorization', () => {
    io.emit('unauthenticated');
    socket.disconnect(true);
  });

  socket.on('logout', () => {
    socket.disconnect(true);
  });

  socket.on('create-account', payload => wsCreateAccount(payload, io));
  socket.on('login', payload => wsLogin(payload, io));
});

export { client, log };
