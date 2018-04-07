const mocha=require("mocha");
const chai=require("chai");
const chaiHttp=require("chai-http");
const should=chai.should();
const app=require("../bin/www");
chai.use(chaiHttp);

describe("Search service test",function(){

    before(function(done){
        console.log("Test starts");
        done();
    });

    after(function(done){        
        console.log("Test finished");
        done();
    });

    it("Should return sku based on tier ID and category value",
    function(done){
        chai.request(app)
        .post("/photon/ecommerce/svc/api/v1.0.0/search/products")
        .send({cat_pos:'3', catId:'360457'})
        .end(function(err,res){
            res.status.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a("object");
        });
        done();
    });

    it("Should return all sku count based on category",
    function(done){
        chai.request(app).post("/photon/ecommerce/svc/get-category-hierarchy")
        .end(function(err,res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a("object");
        });
        done();
    });

    it("Should return sku details based on the search term",
    function(done){
        chai.request(app).post("/photon/ecommerce/svc/api/v1.0.0/search")
        .send({query:'massage'})
        .end(function(err,res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a("object");
        });
        done();
    });

    it("Should return sku details based on the skuID",
    function(done){
        chai.request(app).post("/photon/ecommerce/svc/api/v1.0.0/search/products/sku")
        .send({skuID:'sku1751653'})
        .end(function(err,res){
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a("object");
        });
        done();
    });

})
