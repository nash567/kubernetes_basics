const keys = require('./keys');

// Express App Setup
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres Client Setup
const { Client } = require('pg');
const pgClient = new Client({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
});

pgClient.on('connect', () => {
  console.log('trying t connection to postgres')
  pgClient
    .query('CREATE TABLE IF NOT EXISTS valuesbipen (number INT)')
    .catch((err) => console.log("error connecting to pg",err));
    console.log('connection to postgres sucessful')
});

// Redis Client Setup
const redis = require('redis');
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});
const redisPublisher = redisClient.duplicate();

// Express route handlers

app.get('/', (req, res) => {
  console.log(req.originalUrl) // '/admin/new?sort=desc'
  console.log(req.baseUrl) // '/admin'
  console.log(req.path) // 
  console.log("hi i m called with rq /")
  res.send('Hi');
});

app.get('/values/all', async (req, res) => {
  console.log("request has entered this /all route")
  const values = await pgClient.query('SELECT * from valuesbipen');
  console.log(values)
  console.log("values are",JSON.stringify(values))
  res.send(values.rows);
});
app.get('/api/values/all', (req, res) => {
  console.log("hi i m called with rq /api/values/all")
  res.send('Hi');
});

app.get('/values/current', async (req, res) => {
  console.log("request has entered this /current route")
  redisClient.hgetall('values', (err, values) => {
    res.send(values);
  });
});

app.post('/values', async (req, res) => {

  console.log("request has reaced /values route")
  const index = req.body.index;

  if (parseInt(index) > 40) {
    return res.status(422).send('Index too high');
  }

  redisClient.hset('values', index, 'Nothing yet!');
  redisPublisher.publish('insert', index);
  pgClient.query('INSERT INTO valuesbipen(number) VALUES($1)', [index]);

  res.send({ working: true });
});
app.all('*', function(req, res) {
  console.log(req.originalUrl) // '/admin/new?sort=desc'
  console.log(req.baseUrl) // '/admin'
  console.log(req.path) // 
  console.log("i am umatched url")
  return res.status(422).send('Index too high');

});
app.listen(5000, (err) => {
  console.log('Listening on port.... ' + 5000);
});
