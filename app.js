const express = require('express');
const { env } = require('./config/config');
var bodyParser = require("body-parser");

 // const router = require('./src/routes/accountRoute');
const accountRouter = require('./src/routes/accountRoute');

const app = express();
app.use(bodyParser.json());

// To check health of the application, is it up / down. Usually load balancer use this
app.get('/health', (req, res) => {
    res.send('Healthy');
})

//app.use('/',router);
app.use('/',accountRouter.router);
// console.log(accountRoute.size);

app.listen(env.PORT,()=> console.log(`Server connection successful on port ${env.PORT}`));
