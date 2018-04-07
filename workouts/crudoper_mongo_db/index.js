var express=require('express');
var app=express();
var mongodb = require('mongodb');
var bodyParser = require('body-parser')

app.use( bodyParser.json() );   

console.log("app starts")

app.listen(3002);

app.get("/",(req,res) => {
    res.send('Welcome');
});

app.post("/addStudent",(req,res) => {
    debugger;
    // Get a Mongo client to work with the Mongo server
    var MongoClient = mongodb.MongoClient;
 
    // Define where the MongoDB server is
    var url = 'mongodb://localhost:27017/';
 
    // Connect to the server
    MongoClient.connect(url, function(err, db){
      if (err) {
        console.log('Unable to connect to the Server:', err);
      } else {
        console.log('Connected to Server');
 
        var dbo = db.db("school");

        // Get the documents collection
        
 
        console.log('Collection retrived before');

        // Get the student data passed from the form
        var student1 = {student: req.body.student, street: req.body.street,
          city: req.body.city, state: req.body.state, sex: req.body.sex,
          gpa: req.body.gpa};
 
        // Insert the student data into the database
        dbo.collection('students').insertOne(student1, function (err, result){
          if (err) {
            console.log(err);
          } else {
 
            // Redirect to the updated student list
            res.send(result);
          }
 
          // Close the database
          db.close();
        });
    }});
});


app.get('/listStudent', function(req, res){

    // Get a Mongo client to work with the Mongo server
    var MongoClient = mongodb.MongoClient;
  
    // Define where the MongoDB server is
    var url = 'mongodb://localhost:27017/';
  
    // Connect to the server
    MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the Server', err);
    } else {

      // We are connected
      console.log('Connection established to', url);
  
      var dbo = db.db("school");

      // Get the documents collection
      
  
      // Find all students
      dbo.collection('students').find({}).toArray(function (err, result) {

        if (err) {
          res.send(err);
        } else if (result.length) {
          res.send(result);
        } else {
          res.send('No documents found');
        }
        //Close connection
        db.close();
      });
    }
    });
  });
  

  app.delete('/deleteStudent', function(req, res){

    // Get a Mongo client to work with the Mongo server
    var MongoClient = mongodb.MongoClient;
  
    // Define where the MongoDB server is
    var url = 'mongodb://localhost:27017/';
  
    // Connect to the server
    MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the Server', err);
    } else {

      // We are connected
      console.log('Connection established to', url);
  
      var dbo = db.db("school");

      // delete the documents collection
      
      var myquery = { _id : req.body._id};

      console.log(myquery);
  
      // Find all students
      dbo.collection('students').deleteOne(myquery,function (err, result) {

        if (err) {
          res.send(err);
        } else {          
          res.send('record deleted');
        }
        //Close connection
        db.close();
      });
    }
    });
  });


  app.put('/updateStudent', function(req, res){

    // Get a Mongo client to work with the Mongo server
    var MongoClient = mongodb.MongoClient;
  
    // Define where the MongoDB server is
    var url = 'mongodb://localhost:27017/';
  
    // Connect to the server
    MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log('Unable to connect to the Server', err);
    } else {

      // We are connected
      console.log('Connection established to', url);
  
      var dbo = db.db("school");

      // delete the documents collection
      
      var myquery = { _id : req.body._id};
      var newvalues = {$set:{student: req.body.student, street: req.body.street,
        city: req.body.city, state: req.body.state, sex: req.body.sex,
        gpa: req.body.gpa}};

      console.log(myquery);
      console.log(newvalues);
  
      // Find all students
      dbo.collection('students').updateOne(myquery,newvalues,function (err, result) {

        if (err) {
          res.send(err);
        } else if (result.length) {
            res.send(result);
        } else {          
          res.send('record updated');
        }
        //Close connection
        db.close();
      });
    }
    });
  });