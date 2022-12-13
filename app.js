var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var alert = require('alert');

var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
var inserRouter = require('./routes/insert');
const { notStrictEqual } = require('assert');

var tabla = "prueba";

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/insert', inserRouter);
//app.use('/users', usersRouter);


app.post("/insert", urlencodedParser, function (req, res) {
  // Replace the uri string with your MongoDB deployment's connection string.
  const uri = "mongodb+srv://Ruben:m8801jz@cluster0.8w9de.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  mongoose.connect(uri, function(err, db) {
    
      console.log("Hasta aquí bien insert");
      var nom = req.body.name;
      var ape = req.body.apel;
      if(nom === ""){
        
        alert("Hay que introducir un nombre!");

      }else if(ape===""){

        alert("Hay que introducir un apellido!");

      }else{
        var myobj = { nombre: req.body.name , apellido: req.body.apel };
        db.collection(tabla).insertOne(myobj, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          db.close();
        });

        res.render('mensaje', { 
          title:'Elementos insertados',
          descrip:'Se han insertado correctamente',
          enlace: '/insert'
        });

      }
        

  });

});

app.get('/setup', function(req, res) {

  // Replace the uri string with your MongoDB deployment's connection string.
  const uri = "mongodb+srv://Ruben:m8801jz@cluster0.8w9de.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  mongoose.connect(uri, function (err, db) {
    console.log("Hasta aquí bien lista");
     db.collection(tabla).find().toArray( async function (err, result) {
      if (err)
        throw err;
      //console.log(result);
      // Render index.pug page using array 
      res.render('tabla', {
        'personList': result,
        title: 'Lista de Nombres'
      });
      db.close();
    });
  });
});


app.get('/delete/:nombre',function(req, res) {

  // Replace the uri string with your MongoDB deployment's connection string.
  const uri = "mongodb+srv://Ruben:m8801jz@cluster0.8w9de.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  mongoose.connect(uri, function(err, db) {
    console.log("Hasta aquí bien delete");

    var myquery = { nombre: req.params.nombre};
    db.collection(tabla).deleteOne(myquery, function(err, obj) {
      if (err) throw err;
      console.log("1 document deleted");
      
      res.render('mensaje', { 
        title:'Elementos eliminados',
        descrip:'Se han eliminado correctamente',
        enlace:'/'
      });



      
      db.close();
    });

  });
});

//Ver objeto

var ob = {
  nombre:"",
  apellido:""
}
app.get('/ver/:nombre',function(req, res) {

  ob.nombre = req.params.nombre;
  ob.apellido = req.params.apellido;

  // Replace the uri string with your MongoDB deployment's connection string.
  const uri = "mongodb+srv://Ruben:m8801jz@cluster0.8w9de.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  mongoose.connect(uri, function(err, db) {
    console.log("Hasta aquí bien ver objeto");
    var myquery = { nombre: req.params.nombre };
     db.collection(tabla).find(myquery).toArray( async function (err, result) {
      if (err)
        throw err;
      //console.log(result);
      // Render index.pug page using array 
      res.render('ver', {
        'personList': result
      });
      db.close();
    });
  });

});

//update
app.post("/update", urlencodedParser, function (req, res) {
  // Replace the uri string with your MongoDB deployment's connection string.

  var nomm = ob.nombre;
  var apell = ob.apellido;
  const uri = "mongodb+srv://Ruben:m8801jz@cluster0.8w9de.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  mongoose.connect(uri, function(err, db) {
    
      console.log("Hasta aquí bien update");

      db.collection(tabla).updateOne({nombre: nomm }, 
                                          {$set: {nombre: req.body.name , apellido: req.body.apel}});

      console.log("Hasta aquí bien ver modificado");
      var myquery = { nombre: req.body.name};
      db.collection(tabla).find(myquery).toArray( async function (err, result) {
        if (err)
          throw err;
        //console.log(result);
        // Render index.pug page using array 
        res.render('ver', {
          'personList': result
        });
        db.close();
      });
  });

  ob.nombre = "";
  ob.apellido = "";

});






// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));

  res.render('error');
});

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);

  res.render('error');
});

module.exports = app;
