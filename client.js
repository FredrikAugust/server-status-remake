// Client-side stuff
// Created by Fredrik A. Madsen-Malmo

// Require
var exec = require('child_process').exec;
var Promise = require('promise');

// Commands

/**
 * Gets the output from a regex performed on a unix command
 * @param  {RegExp} re      The regex to use on the stdout
 * @param  {String} command The command to be used
 * @return {Object}         Promise with either error string or the value
 */
var getcommand = function (re, command) {
    return new Promise(function (resolve, reject) {
        exec(command, function (err, stdout, stderr) {
            if (!err) {
                if (re.test(stdout)) {
                    resolve(re.exec(stdout)[1]);
                } else {
                    reject('Error in command ' + command);
                }
            } else {
                reject(err);
            }
        });
    });
};

/**
 * Gets the drivestats, please do not touch. Will break on contact. FRAGILE
 * @return {Object} Returns a promise
 */
var drivestats = function () {
    var stats = [];

    var create = new Promise(function (resolve, reject) {
        exec("df -h | grep '/dev/' && df -h --total | grep 'total'", function (err, stdout, stderr) {
            if (!err) {
                resolve(stdout.split('\n').slice(0, stdout.split('\n').length - 1));
            } else {
                reject(err);
            }
        });
    });

    return new Promise(function(resolve, reject) {
        create.then(function (result) {
            result.forEach(function (item) {
                var temp = [];

                item.split(' ').forEach(function (item2) {
                    if (item2.length > 0) {
                        temp.push(item2);
                    }
                });

                stats.push(temp);
            });

            resolve(stats);
        }, function (err) {
            reject(err);
        });
    });
};

var memstats = function () {
    var re = /[\d\.]+\w/g;
    var result = [];

    return new Promise(function(resolve, reject) {
        exec("free -h", function (err, stdout, stderr) {
            if (err) {
                reject(err);
            }

            while ((result = re.exec(stdout)) !== null) {console.log(result[0]);}

            resolve(result);
        });
    });
};

// Exports
module.exports = {
    getcommand: getcommand,
    drivestats: drivestats,
    memstats: memstats
};
