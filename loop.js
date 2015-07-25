// Loop stuff
// Created by Fredrik A. Madsen-Malmo

var client = require('./client.js');
var db = require('./db.js');
var sleep = require('sleep').sleep;

// RegExp variables
var cpuload_re = /average.\ ([0-9]+\.[0-9]+)+/;
var cpuload_str = 'uptime';

var cputemp_re = /Physical\ id\ 0\:[\s]*\+([\d]+\.[\d])../;
var cputemp_str = "sensors | grep 'Physical id 0:'";

while (true) {
    console.log('Inserting temp');
    db.insert('temp', client.getcommand(cputemp_re, cputemp_str)).then(function (result) {
        console.log('Inserted: ' + result);
        sleep(5);
    }, function (err) {
        throw err;
    });

    console.log('Inserting load');
    db.insert('load', client.getcommand(cpuload_re, cpuload_str)).then(function (result) {
        console.log('Inserted: ' + result);
        sleep(5);
    }, function (err) {
        throw err;
    });
}
