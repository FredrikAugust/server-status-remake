// MongoDB stuff
// Created by Fredrik A. Madsen-Malmo

// Imports
var mongo = require('mongodb').MongoClient;
var assert = require('assert');
var Promise = require('promise');

// Mongo config
var PORT = 27017 || process.env.MONGOPORT;
var HOST = 'localhost' || process.env.MONGOHOST;
var DB = 'serverstatus' || process.env.MONGODB;

var URL = 'mongodb://' + HOST + ':' + PORT + '/' + DB;

// Base function
var WEEKDAYS = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];

/**
 * Connects to the database and calls the anon function provided
 * @param  {Function}  Func Anon function to call
 * @return {null}      No return value
 */
var connect = function (func) {
    mongo.connect(URL, function (err, db) {
        if (err) {
            throw err;
        }

        assert.equal(null, err);
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
 * @param  {String}   mode  either 'temp' or 'load'; what kind of entry
 * @param  {String}    value the value to insert.
 * @return {Function} A promise with the value passed in
 */
var insert = function (mode, value) {
    return new Promise(function (resolve, reject) {
        connect(function (db) {
            if (mode.toLowerCase() == 'temp') {
                db.collection('temp').insertOne({
                    "time": new Date(),
                    "temp": (parseFloat(value.replace(',', '.')))
                }, function(err, result){insertCallback(err, result, db, resolve, reject);});
            } else if (mode.toLowerCase() == 'load') {
                db.collection('load').insertOne({
                    "time": new Date(),
                    "load": ((parseFloat(value) / 4) * 100)
                }, function(err, result){insertCallback(err, result, db, resolve, reject);});
            } else {
                db.close();
                reject('Invalid input');
            }
        });
    });
};

/**
 * Gets the 20 last entries of one mode
 * @param  {String} mode The type of entry to retrieve
 * @return {Function}    Returns either a resolve or reject function
 */
var realtime = function (mode) {
    var latest = [];

    return new Promise(function (resolve, reject) {
        connect(function (db) {
            var cursor = db.collection(mode).find({  }).limit(20).sort({time:-1});

            cursor.each(function (err, doc) {
                if (err) {
                    reject(err);
                }

                assert.equal(err, null);

                if (doc !== null) {
                    // Push [hh:mm:ss, temp|load] to latest
                    latest.push([doc.time.toTimeString().substr(0, 8),
                                 (doc.temp || doc.load)]);
                } else {
                    resolve(latest);
                    db.close();
                }
            });
        });
    });
};

/**
 * Get's the average temperature for the 20 last minutes
 * @param  {String} What type of entry to retrieve
 * @return {Array}  Two-dimentional array with HH:MM and temp|load:float
 */
var minute = function (mode) {
    var minutes = [];

    return new Promise(function (resolve, reject) {
        connect(function (db) {
            var count = -1;
            var prev = -1;
            var count_internal = 2;

            var cursor = db.collection(mode).find({}).sort({time:-1});

            cursor.each(function (err, doc) {
                if (err) {
                    reject(err);
                }

                assert.equal(err, null);

                if (doc !== null) {
                    if (count <= 20 && doc.time.getMinutes() == prev) {
                        // Push [hh:mm:ss, temp|load] to minutes
                        minutes[count] = [doc.time.toTimeString().substr(0, 5),
                                          (minutes[count][1] + (doc.temp || doc.load)) / 2];
                        count_internal++;
                    } else if (count <= 20 && doc.time.getMinutes() != prev) {
                        count++;
                        prev = doc.time.getMinutes();
                        // Push [hh:mm:ss, temp|load] to minutes
                        minutes[count] = [doc.time.toTimeString().substr(0,5),
                                          0 + (doc.temp || doc.load)];
                        count_internal = 2;
                    } else {
                        resolve(minutes);
                        db.close();
                    }
                } else {
                    resolve(minutes);
                    db.close();
                }
            });
        });
    });
};

/**
 * Get's the average temperature for the last 10 hours
 * @param  {String} What type of entry to retrieve
 * @return {Array}  Two-dimentional array with Weekday date, hour:00
 */
var hour = function(mode) {
    var hours = [];

    return new Promise(function (resolve, reject) {
        connect(function (db) {
            var count = -1;
            var prev = -1;
            var count_internal = 2;

            var cursor = db.collection(mode).find({}).sort({time:-1});

            cursor.each(function (err, doc) {
                if (err) {
                    reject(err);
                }

                assert.equal(err, null);

                if (doc !== null) {
                    if (count <= 10 && doc.time.getHours() == prev) {
                        // Push [hh:mm:ss, temp|load] to hours
                        hours[count] = [WEEKDAYS[doc.time.getDay()] + ' ' +
                                        doc.time.getDate() + ', ' +
                                        doc.time.toTimeString().substr(0,2) + ':00',
                                        (hours[count][1] + (doc.temp || doc.load)) / 2];
                        count_internal++;
                    } else if (count <= 10 && doc.time.getHours() != prev) {
                        count++;
                        prev = doc.time.getHours();
                        // Push [hh:mm:ss, temp|load] to hours
                        hours[count] = [WEEKDAYS[doc.time.getDay()] + ' ' +
                                        doc.time.getDate() + ', ' +
                                        doc.time.toTimeString().substr(0,2) + ':00',
                                        0 + (doc.temp || doc.load)];
                        count_internal = 2;
                    } else {
                        resolve(hours);
                        db.close();
                    }
                } else {
                    resolve(hours);
                    db.close();
                }
            });
        });
    });
};

/**
 * Get's the average temperature for the last week
 * @param  {String} What type of entry to retrieve
 * @return {Array}  Two-dimentional array with Weekday date/month
 */
var day = function(mode) {
    var days = [];

    return new Promise(function (resolve, reject) {
        connect(function (db) {
            var count = -1;
            var prev = -1;
            var count_internal = 2;

            var cursor = db.collection(mode).find({}).sort({time:-1});

            cursor.each(function (err, doc) {
                if (err) {
                    reject(err);
                }

                assert.equal(err, null);

                if (doc !== null) {
                    if (count <= 7 && doc.time.getDate() == prev) {
                        // Push [hh:mm:ss, temp|load] to days
                        days[count] = [WEEKDAYS[doc.time.getDay()] + ' ' +
                                        doc.time.getDate() + '/' +
                                        (doc.time.getMonth() + 1),
                                        (days[count][1] + (doc.temp || doc.load)) / 2];
                        count_internal++;
                    } else if (count <= 7 && doc.time.getDate() != prev) {
                        count++;
                        prev = doc.time.getDate();
                        // Push [hh:mm:ss, temp|load] to days
                        days[count] = [WEEKDAYS[doc.time.getDay()] + ' ' +
                                        doc.time.getDate() + '/' +
                                        (doc.time.getMonth() + 1),
                                        0 + (doc.temp || doc.load)];
                        count_internal = 2;
                    } else {
                        resolve(days);
                        db.close();
                    }
                } else {
                    resolve(days);
                    db.close();
                }
            });
        });
    });
};

// Exports

module.exports = {
    insert: insert,
    realtime: realtime,
    minute: minute,
    hour: hour,
    day: day
};
