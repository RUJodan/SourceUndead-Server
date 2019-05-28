import express from 'express';
import bodyParser from 'body-parser';
import redis from 'redis';
import cors from 'cors';
import logger from 'winston';

// GET/POST routing (JSX templates, POST functions)
// import login from './routes/login';
import createAccount from './routes/createAccount';
import login from './routes/login';

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
app.use(cors());

// create redis handler
// MAKE SURE REDIS IS RUNNING THIS TIME, YOU ASSJACK
const client = redis.createClient(6379, 'localhost');

// setup view engine for EJS templating
app.set('view engine', 'ejs')
  .use(express.static(`${__dirname}/public`)); // expose public folder static serve

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true,
}));

// create the server
const server = app.listen(8080, () => {
  const { port } = server.address();
  log.info(`SourceUndead has risen from the grave on port ${port}`);
});

app.use('/create-account', createAccount);
app.use('/login', login);

export { client, log };
