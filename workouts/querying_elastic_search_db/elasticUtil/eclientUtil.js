const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({
  host: process.env.elasticsearch,
  sniffOnStart: true,
  sniffInterval: process.env.elasticsearch_shiftinterval,
});
exports.client = client;
