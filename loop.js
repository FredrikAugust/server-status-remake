// Loop stuff
// Created by Fredrik A. Madsen-Malmo

var client = require('./client.js');
var db = require('./db.js');

// RegExp variables
var cpuload_re = /average.\ ([0-9]+\.[0-9]+)+/;
var cpuload_str = 'uptime';

var cputemp_re = /Physical\ id\ 0\:[\s]*\+([\d]+\.[\d])../;
var cputemp_str = "sensors | grep 'Physical id 0:'";

client.getcommand(cputemp_re, cputemp_str).then(function (result_get) {
	db.insert('temp', result_get).then(function (result) {}, function (err) {});
}, function (err_get) {});

client.getcommand(cpuload_re, cpuload_str).then(function (result_get) {
	db.insert('load', result_get).then(function (result) {}, function (err) {});
}, function (err_get) {});
