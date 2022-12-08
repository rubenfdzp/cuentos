var express = require('express');
var router = express.Router();


//
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var alert = require('alert');




router.get('/', function(req, res, next) {
  const uri = "mongodb+srv://Ruben:m8801jz@cluster0.8w9de.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  mongoose.connect(uri, function (err, db) {
    console.log("Hasta aquí bien lista");
     db.collection("prueba").find().toArray( async function (err, result) {
      if (err)
        throw err;
      //console.log(result);
      // Render index.pug page using array 
      res.render('index', {
        'personList': result,
        title: 'Lista de Nombres'
      });
      db.close();
    });
  });





});
module.exports = router;



