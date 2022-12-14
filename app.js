const express = require('express');
const { env } = require('./config/config');
var bodyParser = require("body-parser");

 // const router = require('./src/routes/accountRoute');
const accountRouter = require('./src/routes/accountRoute');
const authRouter = require('./src/routes/authRoute');

const app = express();
app.use(bodyParser.json());

// To check health of the application, is it up / down. Usually load balancer use this
app.get('/health', (req, res) => {
    res.send('Healthy');
})

//app.use('/',router);
//app.use('/',accountRouter.router);
app.use('/',authRouter.router);
// console.log(accountRoute.size);


///////

//app.use(middleware1);
app.use(middleware1);

app.get('/users',auth, (req,res) => {
  console.log('This is standard api');
  res.send('users page');
  
});

//app.use(middleware3);

function auth(req,res,next) {
   
  if (req.query.admin === 'true') {
    console.log('auth user');
    next();
  }
    console.log('No auth');
    next();
  
}

function middleware1(req,res,next) {
    console.log('This is middleware #1');
    next();
  }
  
function middleware2(req,res,next) {
  console.log('This is middleware #2');
  //next();
}

function middleware3(req,res,next) {
    console.log('This is middleware #3');
    next();
  }

///////


app.listen(env.PORT,()=> console.log(`Server connection successful on port ${env.PORT}`));
