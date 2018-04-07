var express = require('express');
var router = express.Router();
const global_const = require('../utils/global');
const Mustache = require('mustache');
const fs = require('fs');
let { GraphQLString, GraphQLList, GraphQLObjectType, GraphQLNonNull, GraphQLSchema, GraphQLFloat, GraphQLInt } = require('graphql');
const graphqlHTTP = require('express-graphql');
const client = require('../elasticUtil/eclientUtil').client;
const winston = require('winston');

//debug logger configuration using wiston
const logger = winston.createLogger({
  level: process.env.logginglevel,
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// 
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
/**
 * @swagger
 * definitions:
 *   search:
 *     type: "object" 
 *     properties:
 *       query:
 *         type: "string"       
 *   product-search:
 *     type: "object"
 *     properties:
 *       cat_pos:
 *         type: "string"
 *       cat_id:
 *          type: "string"
 *   product-search-sku:
 *     type: "object"
 *     properties:
 *       skuID:
 *         type: "string" 
 */

/* POST get product detail by search term . */
/**
 * @swagger
 * /photon/ecommerce/svc/api/v1.0.0/search:
 *   post:
 *     tags:
 *       - Search
 *     description: Returns Search term related query
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: "body"
 *         name: "body"
 *         description: "Retrieve data with search term"
 *         required: true
 *         schema:
 *           $ref: "#/definitions/search"
 *     responses:
 *       200:
 *         description: List of data
 *         
 *         
 */
router.post('/api/v1.0.0/search', function (req, res, next) {

  var queryTemp = fs.readFileSync("./config/searchTermBasedSku.mustache").toString();
  winston.debug(queryTemp);
  winston.debug("searchTermBasedSku query template");
  

  const queryData = {
    searchTerm: req.body.query
  }

  const searchQry = Mustache.render(queryTemp, queryData);
  winston.debug(searchQry, "searchTermBasedSku search Query");

  let allSku = [];

  client.search({
    index: this.indexName,
    type: global_const.typeNameProdSKU,
    body: searchQry
  }, function (error, response) {

    response.hits.hits.forEach(function (hit) {
      allSku.push(hit);
    });

    res.send(allSku);
    console.log(allSku.length);
    res.end();
  });

});

/* POST get product category tree . */
/**
 * @swagger
 * /photon/ecommerce/svc/get-category-hierarchy:
 *   post:
 *     tags:
 *       - Search
 *     description: Returns shop menu
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Shop menu
 *                  
 */
router.post('/get-category-hierarchy', function (req, res, next) {

  const queryTemp = fs.readFileSync("./config/categoryHierarichy.mustache").toString();
  winston.debug(queryTemp, "categoryHierarichy query template");

  const queryData = {
    searchTerm: req.body.query
  }

  let catHier = {};

  client.search({
    index: this.indexName,
    type: global_const.typeNameProdCat,
    body: queryTemp

  }, function (error, response) {

    winston.debug(response.aggregations.category1.buckets, "hierarichy response");

    response.hits.hits.forEach(function (hit) {
      catHier = response.aggregations;
    });

    res.send(catHier);
    res.end();
  });
});



/* POST get product sku detail by tier id and product id . */
/**
 * @swagger
 * /photon/ecommerce/svc/api/v1.0.0/search/products:
 *   post:
 *     tags:
 *       - Search
 *     description: Returns Search term related product
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: "body"
 *         name: "body"
 *         description: "Retrieve products related to category"
 *         required: true
 *         schema:
 *           $ref: "#/definitions/product-search"
 *     responses:
 *       200:
 *         description: Products related to category
 */
router.post('/api/v1.0.0/search/products', function (req, res, next) {

  var queryTemp = fs.readFileSync("./config/catBasedSku.mustache").toString();
  winston.debug(queryTemp, "catBasedSku query template");

  const queryData = {
    cat_pos: req.body.cat_pos,
    cat_id: req.body.cat_id
  }

  const searchQry = Mustache.render(queryTemp, queryData);
  winston.debug(searchQry, "catBasedSku search Query");

  let allSku = [];

  client.search({
    index: this.indexName,
    body: searchQry
  }, function (error, response) {

    response.hits.hits.forEach(function (hit) {
      allSku.push(hit);
    });

    res.send(allSku);
    winston.debug(allSku.length);
    res.end();
  });
  
});

/* POST get product sku detail by skuID . */
/**
 * @swagger
 * /photon/ecommerce/svc/api/v1.0.0/search/products/sku:
 *  post:
 *    tags:
 *      - Search
 *    description: Returns product sku details by skuID
 *    produces:
 *      - application/json
 *    parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "product sku id"
 *        schema:
 *           $ref: "#/definitions/product-search-sku"
 *    responses:
 *      200:
 *        description:sku details related to skuID
 */
router.post('/api/v1.0.0/search/products/sku', function (req, res, next) {

  var queryTemp = fs.readFileSync("./config/skuIDBasedSkuData.mustache").toString();
  winston.debug(queryTemp, "skuIDBasedSku details query template");

  const queryData = {
    skuID: req.body.skuID,    
  }

  const searchQry = Mustache.render(queryTemp, queryData);
  winston.debug(searchQry, "skuIDBasedSku search Query");

  client.search({
    index: this.indexName,
    type: global_const.typeNameProdSKU,
    body: searchQry
  }, function (error, response) {

    res.send(response.hits.hits);    
    res.end();
  });

});

module.exports = router;
