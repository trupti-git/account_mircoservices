const db = require('../../db/mongo');
const router = require('express').Router();

console.log('inside router');


const getAccountdetails = async (req,res)=>{
    const data = await db.get().collection('accounts').find({}).limit(0).toArray();
    try{
        if ( data && data.length > 0){
                res.send(data);
        }
    }catch(err){
        res.status(500).send(err);
    }
    
}

const createAccount = async(req,res) =>{
    const insertQuery = (req.body);
    await db.get().collection('accounts').insertOne(insertQuery);
    const count =  db.get().collection('accounts').countDocuments();
    count
    .then((totalcount)=>{
        res.setHeader('total-records',totalcount);
        res.send('Account created successfully');
    }).catch((err)=>{
        res.send(err);
    })
    
}

const updateAccount = async(req,res)=>{
    const findQuery = { account_id: Number(req.query.id) };
    const updateQuery = { limit: Number(req.query.limit) };
    
    const result = await db.get().collection('accounts').updateOne(findQuery,{$set: updateQuery});
    //console.log(result);
    if ( result && result.modifiedCount > 0 ) {
    res.send('Account updated successfully');
    }
}

const deleteAccount = async(req,res)=>{
    const deleteQuery = { account_id:Number(req.query.id)};
    
    const result = await db.get().collection('accounts').deleteOne(deleteQuery);
    if ( result && result.deletedCount > 0 ) {
        //console.log(result);
        res.send('Account deleted successfully');
    }

}

router.get('/accounts',getAccountdetails);
router.post('/accounts',createAccount);
router.put('/accounts',updateAccount);
router.delete('/accounts',deleteAccount);

const size = 10;

module.exports = {
    router,
    size
}
// or
//exports.router = router;

// module.exports = router;