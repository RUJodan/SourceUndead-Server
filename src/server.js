import express from 'express';
import redis from 'redis';
import logger from 'winston';
import socketIO from 'socket.io';

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
  log.info('Websocket connection established');

  socket.on('create-account', payload => wsCreateAccount(payload, io));
  socket.on('login', payload => wsLogin(payload, io));
});

export { client, log };
