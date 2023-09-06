const express = require('express');
const fs = require('fs');
const errorPage = express.Router();

errorPage.use((req,res) => {
  fs.readFile('./error/index.html',(error,data) => {
    if(error) return res.status(404).json({ message: 'Error code 404!!'});
    res.writeHead(200,{'Content-Type':'text/html'});
    res.write(data);
    res.end();
  });
})

module.exports = errorPage;