// MongoDB stuff
// Created by Fredrik A. Madsen-Malmo

// Imports
var mongo = require('mongodb').MongoClient;
var assert = require('assert');

// Mongo config
var PORT = 27017 || process.env.MONGOPORT;
var HOST = 'localhost' || process.env.MONGOHOST;
var DB = 'serverstatus' || process.env.MONGODB;

var URL = 'mongodb://' + HOST + ':' + PORT + '/' + DB;

// Base function

/**
 * Connects to the database and calls the anon function provided
 * @param  {function}  Func Anon function to call
 * @return {null}      No return value
 */
var connect = function (func) {
    mongo.connect(URL, function (err, db) {
        if (err) {
            console.log(err);
        }

        assert.equal(null, err);

        console.log('Connected to server.');
        func(db);
    });
};

// DB functions

/**
 * Callback used for the isert function
 * @param  {Object}   err     This is the Error object that describes the error encountered
 * @param  {Object}   result  This is the result, contains all info about the insert
 * @param  {Object}   db      The database object, here I use it to close the db
 * @param  {Function} resolve This is the function to be called when the script completes
 * @param  {Function} reject  This is the function to be called if the script fails
 * @return {Object}           Resolve or Reject
 */
function insertCallback (err, result, db, resolve, reject) {
    if (err) {
        reject(err);
    }

    assert.equal(err, null);

    db.close();
    resolve(result);
}

/**
 * Insert an entry into the db
 * @param  {string}   mode  either 'temp' or 'load'; what kind of entry
 * @param  {float}    value the value to insert. float
 * @return {Promise}  A promise with the value passed in
 */
var insert = function (mode, value) {
    return new Promise(function (resolve, reject) {
        connect(function (db) {
            if (mode.toLowerCase() == 'temp') {
                db.collection('temp').insertOne({
                    "time": new Date(),
                    "temp": value
                }, function(err, result){insertCallback(err, result, db, resolve, reject);});
            } else if (mode.toLowerCase() == 'load') {
                db.collection('load').insertOne({
                    "time": new Date(),
                    "load": value
                }, function(err, result){insertCallback(err, result, db, resolve, reject);});
            } else {
                db.close();
                reject('Invalid input');
            }
        });
    });
};

/**
 * [realtime description]
 * @param  {[type]} mode [description]
 * @return {[type]}      [description]
 */
var realtime = function (mode) {
    var latest = [];

    return new Promise(function (resolve, reject) {
        connect(function (db) {
            var cursor = db.collection(mode).find({  }).limit(20);

            cursor.each(function (err, doc) {
                if (err) {
                    reject(err);
                }

                assert.equal(err, null);

                if (doc !== null) {
                    // Push [hh:mm:ss, temp|load] to latest
                    if (mode.toLowerCase() == 'temp') {
                        latest.push([doc.time.getHours() + ':' +
                                          doc.time.getMinutes() + ':' +
                                          doc.time.getSeconds(),
                                          doc.temp]);
                    } else if (mode.toLowerCase() == 'load') {
                        latest.push([doc.time.getHours() + ':' +
                                          doc.time.getMinutes() + ':' +
                                          doc.time.getSeconds(),
                                          doc.load]);
                    }
                } else {
                    resolve(latest);
                    db.close();
                }
            });
        });
    });
};

/**
 * Get's the average temperature for the 20 last minutes_temp
 * @return {array} Two-dimentional array with HH:MM and temp:float
 */
var temp_minute = function () {
    var minutes_temp = [];

    return new Promise(function (resolve, reject) {
        connect(function (db) {
            var count = -1;
            var prev = -1;
            var count_internal = 2;

            var cursor = db.collection('temp').find({}).sort(['time', -1]);

            cursor.each(function (err, doc) {
                if (err) {
                    reject(err);
                }

                assert.equal(err, null);

                if (doc !== null) {
                    if (count <= 20 && doc.time.getMinutes() == prev) {
                        // Push [hh:mm:ss, temp] to latest_temp
                        minutes_temp[count] = [doc.time.getHours() + ':' + doc.time.getMinutes(),
                                               (minutes_temp[count][1] + doc.temp) / 2];
                        count_internal++;
                    } else if (doc.time.getMinutes() != prev) {
                        count++;
                        prev = doc.time.getMinutes();
                        // Push [hh:mm:ss, temp] to latest_temp
                        minutes_temp[count] = [doc.time.getHours() + ':' + doc.time.getMinutes(),
                                               0 + doc.temp];
                        count_internal = 2;
                    } else {
                        resolve(minutes_temp);
                        db.close();
                    }
                } else {
                    resolve(minutes_temp);
                    db.close();
                }
            });
        });
    });
};

// Exports

module.exports = {
    insert: insert,
    realtime: realtime
};

// Testing

realtime('temp').then(function (res) {console.log(res);}, function (err) {console.log(err);});
// insert('temp', 35).then(function (res) {console.log(res);}, function (err) {console.log(err);});
// temp_minute().then(function (result) {console.dir(result, result.length);}, function (err) {console.log(err);});
