// Client-side stuff
// Created by Fredrik A. Madsen-Malmo

// Require
var exec = require('child_process').exec;
var Promise = require('promise');

// Commands

/**
 * Gets the uptime for the server
 * @return {String} The uptime in pretty format
 */
function uptime() {
    return new Promise(function (resolve, reject) {
        exec('uptime -p', function (err, stdout, stderr) {
            if (!err) {
                resolve(stdout);
            } else {
                reject(err);
            }
        });
    });
}

/**
 * Gets the output from a regex performed on a unix command
 * @param  {RegExp} re      The regex to use on the stdout
 * @param  {String} command The command to be used
 * @return {Object}         Promise with either error string or the value
 */
function getcommand(re, command) {
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
}

// RegExp variables
var cpuload_re = /average.\ ([0-9]+\.[0-9]+)+/;
var cpuload_str = 'uptime';

var cputemp_re = /Physical\ id\ 0\:[\s]*\+([\d]+\.[\d])../;
var cputemp_str = "sensors | grep 'Physical id 0:'";

var network_re = /\(([\d]+\.[\d]+\ [\w]+)\)/;
var network_down_str = "ifconfig | grep 'RX bytes' -m 1".split('TX')[0];
var network_up_str = "ifconfig | grep 'RX bytes' -m 1".split('TX')[1];

/**
 * Gets the drivestats, please do not touch. Will break on contact. FRAGILE
 * @return {Object} Returns a promise
 */
function drivestats() {
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
}
