const Mustache = require('mustache');
const fs = require('fs');
const es_client = require('../elasticUtil/eclientUtil').client;
let { GraphQLString, GraphQLList, GraphQLObjectType, GraphQLNonNull, GraphQLSchema, GraphQLFloat, GraphQLInt } = require('graphql');
const EventEmitter = require('events');
class MyEmitter extends EventEmitter { }
const myEmitter = new MyEmitter();
const global_const =require('../utils/global')

//skuType definition in graphQL
const SkuType = new GraphQLObjectType({
    name: "skuType",
    description: "holds the sku details",
    fields: () => ({
        image_url: { type: new GraphQLNonNull(GraphQLString) },
        product_id: { type: new GraphQLNonNull(GraphQLString) },
        spc_price_d: { type: new GraphQLNonNull(GraphQLFloat) },
        product_seo_url: { type: new GraphQLNonNull(GraphQLString) },
        sku_id: { type: new GraphQLNonNull(GraphQLString) },
        brand_name: { type: new GraphQLNonNull(GraphQLString) },
        product_details: { type: new GraphQLNonNull(GraphQLString) },
        most_viewed: { type: new GraphQLNonNull(GraphQLInt) },
        product_name: { type: new GraphQLNonNull(GraphQLString) }
    })
});

//product search root query in graphql
const ProdSearchRootType = new GraphQLObjectType({
    name: "prodSearchRootQuery",
    description: "hold the product search root query",
    fields: () => ({
        product  : {
            type: new GraphQLList(SkuType),
            args: {
                searchTerm: {
                    name: 'searchTerm',
                    type: new GraphQLNonNull(GraphQLString)
                }
            },
            description: "list of all product skus",
            resolve: function (root,params) {
                console.log("search term", params.searchTerm);
                let prodSkuList = [];
                var queryTemp = fs.readFileSync("./config/searchTermBasedSku.mustache").toString();
                console.log(queryTemp, "searchTermBasedSku query template");
                const queryData = {
                    searchTerm: params.searchTerm
                }
                const searchQry = Mustache.render(queryTemp, queryData);
                console.log(searchQry, "searchTermBasedSku search Query");

                let brakewait = false;
                myEmitter.on('event', function (prodSku) {
                    console.log('bottom');
                    brakewait = true;
                });

                return es_client.search({
                    index: this.indexName,
                    type: global_const.typeNameProdSKU,
                    body: searchQry
                }).then(function (response) {

                    response.hits.hits.forEach(function (hit) {
                        prodSkuList.push(hit._source);
                    });

                    console.log(prodSkuList.length, "hi inside");

                    return prodSkuList;
                });
                

            }
        }
    })
})

const schema = new GraphQLSchema({
    query: ProdSearchRootType
});

module.exports = schema;