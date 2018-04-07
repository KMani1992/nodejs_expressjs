process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();
chai.use(chaiHttp);
var mongoose = require('mongoose');
var User = require('mongoose').model('user');
describe('Users', function() {

    before(function(done){
       // User.collection.drop();
        var users = [{firstName:'Dheeraj', lastName:'Pentela', email:'dheerajp@gmail.com'},
        {firstName:'Ravi', lastName:'Pentela', email:'ravi@gmail.com'}]
        User.create(users,function(err) {
          done();
        });
      });
      after(function(done){
        User.collection.drop();       
        done();
      });

    it('should list ALL users on /users GET', function(done) {
        chai.request(server)
          .get('/users')
          .end(function(err, res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');        
            done();
          });
      });


      it('should add a SINGLE user on /users POST', function(done) {
        chai.request(server)
          .post('/users')
          .send({'firstName': 'Dheeraj','lastName':'Pentela', 'email': 'Raja@gmail.com'})
          .end(function(err, res){
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('success');
            res.body.should.be.a('object');
            res.body.should.have.property('firstName');
            res.body.should.have.property('lastName');
            res.body.should.have.property('email');
            res.body.should.have.property('id');
            res.body.firstName.should.equal('Dheeraj');
            res.body.lastName.should.equal('Pentela');
            res.body.email.should.equal('Raja@gmail.com');
            done();
          });
      });

});