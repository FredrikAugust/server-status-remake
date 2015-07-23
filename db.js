// MongoDB stuff
// Created by Fredrik A. Madsen-Malmo

// Imports
var mongo = require('mongodb').MongoClient;
var assert = require('assert');

// Mongo config
var PORT = 27017 || process.env.MONGOPORT;
var HOST = 'localhost' || process.env.MONGOHOST;
var DB = 'serverstatus' || process.env.MONGODB;

var URL = 'mongodb://' + '@' + HOST + ':' + PORT + '/' + DB;

// Base function
var base = function (func) {
    mongo.connect(URL, function (err, db) {
        assert.equal(null, err);
        console.log('Connected to server.');
        console.log('Performing specified function.');
        func();
        db.close();
    });
};

// DB functions
base(function () {
    console.log('test');
});
