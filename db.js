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
 * @param  {function} func Anon function to call
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

// Temperatures

/**
 * Inserts a temperature entry
 * @param  {float} temp The temperature to insert
 * @return {null}  Promise with either err or true
 */
var insert_temp = function (temp) {
    return new Promise(function (resolve, reject) {
        connect(function (db) {
            db.collection('temp').insertOne({
                "time": new Date(),
                "temp": temp
            }, function (err, result) {
                if (err) {
                    reject(err);
                }

                assert.equal(err, null);

                db.close();
                resolve(temp);
            });
        });
    });
};

/**
 * Promise with the latest_temp array of the 20 latest temps and times
 * @return {array} [[time, temp]]
 */
var temp_realtime = function () {
    var latest_temp = [];

    return new Promise(function (resolve, reject) {
        connect(function (db) {
            var cursor = db.collection('temp').find({  }).limit(20);

            cursor.each(function (err, doc) {
                if (err) {
                    reject(err);
                }

                assert.equal(err, null);

                if (doc !== null) {
                    // Push [hh:mm:ss, temp] to latest_temp
                    latest_temp.push([doc.time.getHours() + ':' +
                                      doc.time.getMinutes() + ':' +
                                      doc.time.getSeconds(),
                                      doc.temp]);
                } else {
                    resolve(latest_temp);
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

// Loads

/**
 * Inserts a load entry
 * @param  {float} Load The load in a float e.g. 0.25 == 25% load
 * @return {null}  Promise with either err or true
 */
var insert_load = function (load) {
    return new Promise(function (resolve, reject) {
        connect(function (db) {
            db.collection('load').insertOne({
                "time": new Date(),
                "load": load
            }, function (err, result) {
                if (err) {
                    reject(err);
                }

                assert.equal(err, null);

                db.close();
                resolve(load);
            });
        });
    });
};

/**
 * Promise with the latest_temp array of the 20 latest temps and times
 * @return {array} [[time, temp]]
 */
var load_realtime = function () {
    var latest_load = [];

    return new Promise(function(resolve, reject) {
        connect(function (db) {
            var cursor = db.collection('load').find({  }).limit(20);

            cursor.each(function (err, doc) {
                if (err) {
                    reject(err);
                }

                assert.equal(err, null);

                if (doc !== null) {
                    // Push [hh:mm:ss, load] to latest_load
                    latest_load.push([doc.time.getHours() + ':' +
                                      doc.time.getMinutes() + ':' +
                                      doc.time.getSeconds(),
                                      doc.load]);
                } else {
                    db.close();
                    resolve(latest_load);
                }
            });
        });
    });
};

// Exports

module.exports = {
    // Insert
    insert_temp: insert_temp,
    insert_load: insert_load,

    // Realtime
    temp_realtime: temp_realtime,
    load_realtime: load_realtime
};

temp_minute().then(function (result) {console.dir(result, result.length);}, function (err) {console.log(err);});
