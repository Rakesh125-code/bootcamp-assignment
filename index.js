const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('node:path');
const {ConnectionPool} = require('mssql')
require('dotenv').config();

const cors = require( 'cors');
app.use(cors());
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

//
const config = {
  server: process.env.BOOTCAMP_SERVER,
  user: process.env.BOOTCAMP_USER,
  password: process.env.BOOTCAMP_PASSWORD,
  database: process.env.BOOTCAMP_DATABASE, 
  options: {
      encrypt: true
  }
};

// Create a connection pool
const pool = new ConnectionPool(config);

// Handle errors
pool.connect()
  .then(() => {
      console.log('Connected to the database');
  })
  .catch(err => {
      console.error('Error connecting to the database:', err);
});

//

app.get('/hello', (req, res) => {  
  res.send('Hello Server!')
});

//TASK2
app.get('/api/task2', async (req, res) => {
  if (pool.connected) {
    try {
      const result = await pool.query('SELECT TOP 20 * FROM SalesLT.Customer');
      console.log(result);
      console.log('Query executed successfully for task2. Row count:', result.rowsAffected[0]);
      res.send(result);
    } catch (err) {
      console.error('Error executing SQL query for task2:', err);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.status(500).send('Not connected to the database');
  }
});

//TASK3
app.get('/api/task3', async (req, res) => {
  if (pool.connected) {
    try {
      const result = await pool.query('SELECT sp.Name, color, size, weight FROM SalesLT.ProductCategory as spc INNER JOIN SalesLT.Product as sp ON spc.ProductCategoryID = sp.ProductCategoryID');
      console.log(result);
      console.log('Query executed successfully for task2. Row count:', result.rowsAffected[0]);
      res.send(result);
    } catch (err) {
      console.error('Error executing SQL query for task2:', err);
      res.status(500).send('Internal Server Error');
    }
  } else {
    res.status(500).send('Not connected to the database');
  }
});


app.use(function (req, res, next) {
  //res.header("Access-Control-Allow-Origin",  "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,PATCH");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
})

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {

    console.log(`Server listening at ${PORT}`);
});

//
app.use(express.static(path.join(__dirname, '/build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/build', 'index.html'));
});
