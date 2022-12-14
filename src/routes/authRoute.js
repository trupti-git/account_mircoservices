// create API's /register, /login, /verify
const router = require('express').Router();
const db = require('../../db/mongo');

const getUserRegister = async(req,res)=>{
    //console.log('User registration');
    //console.log(req.body);
    const { firstName,lastName,email,password } = req.body;
    //console.log(firstName);
   
    try{

    if(!(firstName && lastName && email && password )){
        console.log('All user inputs required.');
        res.send('All user inputs required');
        return;
    }

    const existingUser = await db.get().collection('users').findOne({ "email_id":email});
    if (existingUser){
        console.log('User already registered');
        res.send('User already registered.');
        return;
    }

    const newUser = {
        first_name:firstName,
        last_name:lastName,
        email_id:email,
        password:password
    };

    const result = await db.get().collection('users').insertOne(newUser);
    if (result){
        console.log('User registered successfully');
        res.send('User registered successfully');

    }
}catch(err){
    console.log('Error:' + err );
    res.send(err);
}
}

const checkUserLogin = async(req,res)=>{
    const email = req.body.email;
    const pwd = req.body.password;
    if (!(email&&pwd)){
        console.log('Inputs required');
        res.status(401).send('Inputs required to login');
        return;
    }
    
    const user = await db.get().collection('users').findOne({ "email_id":email});
    if(!user){
        console.log('user is not registered');
        res.status(401).send('User is not registered');
        return;
    }
    
    if(!(pwd === user.password)){
        console.log('Invalid user or password');
        res.send('Invalid user or password');
        return;
    }
    return res.send('Login successful');

}

router.post('/register',getUserRegister);
router.post('/login',checkUserLogin);

//auth/register or auth/signup
    //userid, email, password (make password encypted), save this to mongoDB,
    // generate random salt using uuid/v4. encrypt/hash password using salt. finally u will store username, email, salt, hash
//auth/login or auth/signin
    // userid, password as input and generate token, keep expiry 90 min and send back in response
    // create token using secret, keep secret in .env for now. you can generate using
    // node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"
//auth/verify
    // user will pass token in header as (Bearer {token}), you will read token verify it and if valid let him access other API
    // if token invalid return 401

module.exports ={
    router
}