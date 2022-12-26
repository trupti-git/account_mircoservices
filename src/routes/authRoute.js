// create API's /register, /login, /verify
import express from 'express';
const router = express.Router();
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { get as db } from '../../db/mongo.js';
import { env } from '../../config/config.js';
import { logger } from '../../config/winstonConfig.js';

// /**
// * generates random string of characters i.e salt
// * @function
// * @param {number} length - Length of the random string.
// */
// const genRandomString = function(length) {
//     return crypto.randomBytes(Math.ceil(length/2))
//     .toString('hex') /** convert to hexadecimal format */
//     .slice(0,length); /** return required number of characters */
// };

//     /**
// * hash password with sha512.
// * @function
// * @param {string} password - List of required fields.
// * @param {string} salt - Data to be validated.
// */
// const sha512 = function(password, salt) {
//     var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
//     hash.update(password);
//     var value = hash.digest('hex');
//     return {
//         passwordHash: value
//     };
// };

const getUserRegister = async (req, res) => {
  //console.log('User registration');
  //console.log(req.body);
  const { firstName, lastName, email, password } = req.body;
  //console.log(firstName);

  try {
    if (!(firstName && lastName && email && password)) {
      console.log('All user inputs required.');
      res.send('All user inputs required');
      return;
    }

    const existingUser = await db()
      .collection('users')
      .findOne({ email_id: email });
    if (existingUser) {
      console.log('User already registered');
      res.send('User already registered.');
      return;
    }
    let newUser;
    const saltRounds = 10;
    const salt = await bcrypt.genSaltSync(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);
    // const salt = genRandomString(16); /** Gives us salt of length 16 */
    // const { passwordHash } = sha512(password, salt);

    newUser = {
      first_name: firstName,
      last_name: lastName,
      email_id: email,
      password: passwordHash,
      salt: salt,
    };
    //console.log('%%%%%%%%%%%%%%%%%' + newUser);
    //console.log(passwordHash);

    const result = await db().collection('users').insertOne(newUser);
    console.log('res :' + result);
    if (result) {
      console.log('User registered successfully');
      res.send('User registered successfully');
    }
  } catch (err) {
    console.log('Error:' + err);
    res.status(500).send();
  }
};

const getHTMLStr = async (req, res) => {
  // let s1 ='This email represent the collaborators added to the your git repository.';
  // let HTMLStr =  '<p>'+ s1 + '</p>'
  //  + '\n' +
  //  + '<p>' + 'Name: Pankaj Khadse' + '' + 'Role: Admin' + '</p>'
  const { name, role, date } = req.body;

  let htmlstr = `<p>This email represent the collaborators added to the your git repository.</p>
  Here is the URL: <a href="https://github.com/trupti-git/account_mircoservices/">https://github.com/trupti-git/account_mircoservices</a><br><br>
  Name: <b>${name}</b><br>
  Role: ${role}<br>
  <p>Dated: ${date}</p>`;

  res.send(htmlstr);
};

const checkUserLogin = async (req, res) => {
  logger.debug('request to api' + req);
  const email = req.body.email;
  const pwd = req.body.password;
  if (!(email && pwd)) {
    console.log('Inputs required');
    res.status(401).send('Inputs required to login');
    return;
  }

  const user = await db().collection('users').findOne({ email_id: email });
  if (!user) {
    logger.info('user is not registered');
    res.status(401).send('User is not registered');
    return;
  }
  //const passwordHash = await bcrypt.hash(pwd,user.salt);
  //console.log(passwordHash);
  //console.log(user.password + ' ' + pwd);
  const match = await bcrypt.compare(pwd, user.password);
  //console.log(match);
  if (!match) {
    console.log('Invalid user or password');
    res.send('Invalid user or password');
    return;
  }
  console.log(env.SECRET)
  // const accessToken = jwt.sign(email,env.SECRET,{ expiresIn: 60 * 60 });
  const accessToken = jwt.sign(
    {
      email,
    },
    env.SECRET,
    { expiresIn: 60 * 2 }
  );
  return res.json(accessToken);
};

const getUsers = async (req, res) => {
  const data = await db().collection('users').find().toArray();
  //console.log('data :' + JSON.stringify(data));
  res.send(data);
};

function authenticate(req, res, next) {
  if (!req.headers['authorization']) {
    return res.status(401).send();
  }
  const token = req.headers['authorization'].split(' ');
  if (token[0] !== 'Bearer') return res.status(401).send();

  jwt.verify(token[1], env.SECRET, (err) => {
    if (err) {
      res.status(403).send();
      return;
    }
    next();
  });
}

router.post('/register', getUserRegister);
router.post('/login', checkUserLogin);
router.get('/users', authenticate, getUsers);
router.post('/html', getHTMLStr);

//auth/register or auth/signup
//userid, email, password (make password encypted), save this to mongoDB,
// generate random salt using uuid/v4. encrypt/hash password using salt. finally u will store username, email, salt, hash
// add role in the request and allow only Admin, Developer, Support using enum (create new contant file and export through it)
//auth/login or auth/signin
// userid, password as input and generate token, keep expiry 90 min and send back in response
// create token using secret, keep secret in .env for now. you can generate using
// node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"
//auth/verify
// user will pass token in header as (Bearer {token}), you will read token verify it and if valid let him access other API
// if token invalid return 401

export default router;

// to do

// add eslint & eslintrc to project and script under package.json. resolve all formatting issues
// logging using watson library
// make success response & error response
