import express from 'express';
import { env } from './config/config.js';
import bodyParser from 'body-parser';
import moment from 'moment';

//console.log(`Here is a test v1 uuid: ${uuid.v1()}`);

// const router = require('./src/routes/accountRoute');
import accountRouter from './src/routes/accountRoute.js';
import authRouter from './src/routes/authRoute.js';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

// import swaggerDocuments from './swagger.json'; // can't import json directly after node version >v14,
// below is the alternative

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const swaggerDocuments = require('./swagger.json');

// const accountRouter = require('./src/routes/accountRoute').default;
//const authRouter = require('./src/routes/authRoute');

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: ['https://www.section.io', ''], // multiple values pass in array separated by comma and origin: '*' means allow any
  })
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocuments));

// To check health of the application, is it up / down. Usually load balancer use this
app.get('/health', (req, res) => {
  res.send('Healthy');
});

//app.use('/',router);
app.use('/', accountRouter.router);
// console.log(accountRoute.size);

///////

//app.use(middleware1);
app.use(middleware1);

app.get('/users', auth, (req, res) => {
  console.log('This is standard api');
  res.send('users page');
});

//app.use(middleware3);

function auth(req, res, next) {
  if (req.query.admin === 'true') {
    console.log('auth user');
    next();
  }
  console.log('No auth');
  next();
}

function middleware1(req, res, next) {
  console.log('This is middleware #1');
  next();
}

function middleware2(req, res, next) {
  console.log('This is middleware #2');
  //next();
}

function middleware3(req, res, next) {
  console.log('This is middleware #3');
  next();
}

///////

app.listen(env.PORT, () =>
  console.log(`Server connection successful on port ${env.PORT}`)
);
