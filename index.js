const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('node:path');

const cors = require('cors');
app.use(cors());
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.get('/hello', (req, res) => {  
  res.send('Hello Server!')
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin",  "http://localhost:3000");
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