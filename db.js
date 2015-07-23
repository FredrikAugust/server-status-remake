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

/**
 * Connects to the database and calls the anon function provided
 * @param  {function} func Anon function to call
 * @return {null}      No return value
 */
var connect = function (func) {
    mongo.connect(URL, function (err, db) {
        assert.equal(null, err);
        console.log('Connected to server.');
        console.log('Performing specified function.');
        func(db);
    });
};

/**
 * Closes the connection to the db
 * @return {null} No return value
 */
var close = function () {
    mongo.close(function () {
        console.log('Closed the connection to the database.');
    });
};

// DB functions

// Temperatures

/**
 * Inserts a temperature entry
 * @param  {float} temp The temperature to insert
 * @return {null}      No return value
 */
var insert_temp = function (temp) {
    connect(function (db) {
        db.collection('temp').insertOne({
            "time": new Date(),
            "temp": temp
        }, function (err, result) {
            assert.equal(err, null);
            console.log('Inserted date successfully');
        });
    });
};

/**
 * Get's the 20 latest entries of temperature
 * @return {array} Multi-dimentional array containg time and temp
 */
var temp_realtime = function () {
    var latest_temp = [];

    connect(function (db) {
        var cursor = db.collection('temp').find({  }).limit(20);

        cursor.each(function (err, doc) {
            assert.equal(err, null);
            if (doc !== null) {
                latest_temp.append(doc);
                console.dir(doc);
            }
        });
    });

    console.log('Returning an array of length %s.', latest_temp.length);
    return latest_temp;
};

// Loads

/**
 * Inserts a load entry
 * @param  {float} load The load in a float e.g. 0.25 == 25% load
 * @return {null}      No return value
 */
var insert_load = function (load) {
    connect(function (db) {
        db.collection('load').insertOne({
            "time": new Date(),
            "load": load
        }, function (err, result) {
            assert.equal(err, null);
            console.log('Inserted date successfully');
        });
    });
};

/**
 * Get's the 20 latest entries of load
 * @return {array} Multi-dimentional array containg time and load
 */
var load_realtime = function () {
    var latest_load = [];

    connect(function (db) {
        var cursor = db.collection('load').find({  }).limit(20);

        cursor.each(function (err, doc) {
            assert.equal(err, null);
            if (doc !== null) {
                latest_load.append(doc);
                console.dir(doc);
            }
        });
    });

    console.log('Returning an array of length %s.', latest_load.length);
    return latest_load;
};
