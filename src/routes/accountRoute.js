import { get as db } from '../../db/mongo.js';
import express from 'express';
const router = express.Router();
import fetch from 'node-fetch';
import { env } from '../../config/config.js';

// fetch, axios

const createUser = async (req, res) => {
  const url = `${env.API_USERS}/users`;
  const result = await fetch(url, {
    method: 'post',
    body: JSON.stringify(req.body),
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await result.json();
  if (result.status === 201) {
    res.send(data);
  } else {
    res.status(500).send();
  }
};

const getAPIdata = async (req, res) => {
  const drilldowns = req.query.drilldowns || '';
  const measures = req.query.measures;
  // validating request
  if (!drilldowns || !measures) {
    res.status(400).send('request params are invalid');
  }
  //const APIlink = env.API_LINK +'data?'+ 'drilldowns='+drilldowns+'&measures='+measures;
  const APIlink = `${env.API_LINK}/data?drilldowns=${drilldowns}&measures=${measures}`;
  //console.log(APIlink);
  const response = await fetch(APIlink);
  if (response.status === 200) {
    const result = await response.json();
    const { data } = result;
    res.send(data);
  } else {
    res.status(404).send('Error');
  }
};

const getAccountdetails = async (req, res) => {
  const data = await db
    .get()
    .collection('accounts')
    .find({})
    .limit(0)
    .toArray();
  try {
    if (data && data.length > 0) {
      res.send(data);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

const createAccount = async (req, res) => {
  const insertQuery = req.body;
  await db.get().collection('accounts').insertOne(insertQuery);
  const count = db.get().collection('accounts').countDocuments();
  count
    .then((totalcount) => {
      res.setHeader('total-records', totalcount);
      res.send('Account created successfully');
    })
    .catch((err) => {
      res.send(err);
    });
};

const updateAccount = async (req, res) => {
  const findQuery = { account_id: Number(req.query.id) };
  const updateQuery = { limit: Number(req.query.limit) };

  const result = await db
    .get()
    .collection('accounts')
    .updateOne(findQuery, { $set: updateQuery });
  //console.log(result);
  if (result && result.modifiedCount > 0) {
    res.send('Account updated successfully');
  }
};


const deleteAccount = async (req, res) => {
  const deleteQuery = { account_id: Number(req.query.id) };

  const result = await db.get().collection('accounts').deleteOne(deleteQuery);
  if (result && result.deletedCount > 0) {
    //console.log(result);
    res.send('Account deleted successfully');
  }
};

router.get('/accounts', getAccountdetails);
router.post('/accounts', createAccount);
router.put('/accounts', updateAccount);
router.delete('/accounts', deleteAccount);
router.get('/getdatausa', getAPIdata);
router.post('/user', createUser);

export default router;