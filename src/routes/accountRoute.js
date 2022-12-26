import { get as db } from '../../db/mongo.js';
//const db = require('../../db');
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

const getprofit = async (req, res) => {
  const account_id = Number(req.query.account_id);
  let data = [];
  data = await db()
    .collection('transactions')
    .find({ account_id: account_id })
    .project({ _id: 0, transactions: 1 })
    .toArray();
  let transactions = [];
  if (Array.isArray(data) && data.length > 0) {
    transactions = data[0].transactions;
  }

  let action = {
    sell: 0,
    buy: 0,
  };

  transactions.reduce((acc, curr) => {
    const code = curr?.transaction_code?.toLowerCase();

    acc.sell += code === 'sell' ? Number(curr.price) : 0;
    acc.buy += code === 'buy' ? Number(curr.price) : 0;
    return acc;
  }, action);

  const profit = action.sell - action.buy;
  res.send({ sell: action.sell, buy: action.buy, profit });
};

const getShareSummary = async (req, res) => {
  const account_id = Number(req.query.account_id);

  const data = await db()
    .collection('transactions')
    .find({ account_id: account_id })
    .project({ _id: 0, transactions: 1 })
    .toArray();
  let transactions = [];
  if (Array.isArray(data) && data.length > 0) {
    transactions = data[0].transactions;
  }

  res.send(cnt);
};

async function getAccountDetails(req, res) {
  const user = req.query.username;
  //console.log(user);
  const customer = await getCustomerData(user);
  console.log(customer);
  const account = await getAccountData(customer);
  //console.log(account);
  const transactions = await getTransactionData(customer);
  const trans = transactions[0].transactions;

  //////////// nflx
  // const nflx = trans.filter(item => {
  //   console.log(item.symbol);
  //   return (item.symbol).toLowerCase() === 'nflx';
  // })
  //res.send(nflx);

  //////////////// count of shares
  // const countShares = trans.reduce((a,c)=> {
  //   //console.log(c.symbol);
  //   const symbol = c.symbol;
  //   if(!a[symbol]){
  //     a[symbol] = 0;
  //   }
  //   a[symbol] = a[symbol] + 1;
  //   return a;
  // },{});
  // res.send(countShares);

  const totalVal = {
    total: {},
  };
  ////////////// count of shares prices
  const countSharesPrices = trans.reduce((a, c) => {
    if (!a.total[c.symbol]) {
      a.total[c.symbol] = Math.round(Number(c.price));
    } else {
      a.total[c.symbol] += Math.round(Number(c.price));
    }

    return a;
  }, totalVal);

  const countSharesPrices1 = trans.reduce((a, { symbol, price }) => {
    if (!a.total[symbol]) {
      a.total[symbol] = Math.round(Number(price));
    } else {
      a.total[symbol] += Math.round(Number(price));
    }

    return a;
  }, totalVal);

  res.send(totalVal);

  // let actions = {
  //   buy:  0,
  //   sell: 0
  // }
  //  trans.reduce((a,c)=>{
  //   (c.transaction_code).toLowerCase() === 'buy'?a.buy= (a.buy +Number(c.price)):a.sell= (a.sell + Number(c.price));
  //   return a;
  // },actions);
  // console.log(actions);
  // res.send(actions);

  ///////////// get buy n sell data group wise
  //   let actions = {
  //       buy:  {},
  //       sell: {}
  //     }

  // const buy = trans.reduce((a,c)=>{
  //   const symbol = c.symbol;
  //     (c.transaction_code).toLowerCase() === 'buy'
  //     ? (!a.buy[symbol] ? a.buy[symbol] = Math.round(Number(c.price)) : a.buy[symbol] = a.buy[symbol] + Math.round(Number(c.price)))
  //     : (!a.sell[symbol]?a.sell[symbol] = Math.round(Number(c.price)):a.sell[symbol] = a.sell[symbol] + Math.round(Number(c.price)));

  //   return a;
  // },actions);
  //   console.log(actions);
  //   res.send(actions);
}

const getTransactionData = async (account_id) => {
  return new Promise((resolve, reject) => {
    // console.log(user);
    const query = { account_id: account_id };
    //console.log(query);
    const transactions = db()
      .collection('transactions')
      .find(query)
      .project({ _id: 0, transactions: 1 })
      .toArray();
    transactions
      .then((data) => {
        //console.log(data[0].accounts[0])
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const getAccountData = async (account_id) => {
  return new Promise((resolve, reject) => {
    // console.log(user);
    const query = { account_id: account_id };
    //console.log(query);
    const products = db()
      .collection('accounts')
      .find(query)
      .project({ _id: 0, products: 1 })
      .toArray();
    products
      .then((data) => {
        //console.log(data[0].accounts[0])
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
const getCustomerData = async (user) => {
  return new Promise((resolve, reject) => {
    // console.log(user);
    const query = { username: user };
    //console.log(query);
    const userAccount = db()
      .collection('customers')
      .find(query)
      .project({ _id: 0, accounts: 1 })
      .toArray();
    userAccount
      .then((data) => {
        //console.log(data[0].accounts[0])
        resolve(data[0].accounts[0]);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

router.get('/accounts', getAccountdetails);
router.post('/accounts', createAccount);
router.put('/accounts', updateAccount);
router.delete('/accounts', deleteAccount);
router.get('/getdatausa', getAPIdata);
router.post('/user', createUser);
router.get('/profit', getprofit);
router.get('/shares', getShareSummary);
router.get('/accountdetails', getAccountDetails);

export default router;
