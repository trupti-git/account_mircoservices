import express from 'express';
import { env } from './config/config.js';
import bodyParser from 'body-parser';

//console.log(`Here is a test v1 uuid: ${uuid.v1()}`);

import accountRouter from './src/routes/accountRoute.js';
import authRouter from './src/routes/authRoute.js';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

// import swaggerDocuments from './swagger.json'; // can't import json directly after node version >v14,
// below is the alternative

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const swaggerDocuments = require('./swagger.json');

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

app.use('/api/v1/', accountRouter);
app.use('/api/v1/', authRouter);

app.listen(env.PORT, () =>
  console.log(`Server connection successful on port ${env.PORT}`)
);
