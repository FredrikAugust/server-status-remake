// Loop stuff
// Created by Fredrik A. Madsen-Malmo

var client = require('./client.js');
var db = require('./db.js');

// RegExp variables
var cpuload_re = /\:\ ([0-9]+\.[0-9]+|[0-9]+\,[0-9]+)/;
var cpuload_str = 'uptime';

var cputemp_re = /Physical\ id\ 0\:[\s]*\+([\d]+\.[\d])../;
var cputemp_str = "sensors | grep 'Physical id 0:'";

/**
 * Gets the CPU Temperature frmo the client.getcommand function and inserts that
 * to the database
 */
client.getcommand(cputemp_re, cputemp_str).then(function (result_get) {
	db.insert('temp', result_get).then(function (result) {}, function (err) {});
	console.log(result_get);
}, function (err_get) {
	console.log(err_get);
});

/**
 * Gets the CPU Load frmo the client.getcommand function and inserts that
 * to the database
 */
client.getcommand(cpuload_re, cpuload_str).then(function (result_get) {
	db.insert('load', result_get).then(function (result) {}, function (err) {});
	console.log(result_get);
}, function (err_get) {
	console.log(err_get);
});
