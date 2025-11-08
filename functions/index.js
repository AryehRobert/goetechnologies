const express = require("express");
const functions = require("firebase-functions");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname + '/../'));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
