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
 *
 * TODO: Check if the minute/hour/day-value is the same. If not calc and insert average.
 */

var _newTemp = {
	minute: false,
	hour: false,
	day: false
};
var _newLoad = {
	minute: false,
	hour: false,
	day: false
};

var _now = new Date();

var gettingPromise = function (type) {
	return new Promise (function (resolve, reject) {
		resolve(conn.collection(type).find({}).limit(1).toArray()[0]);
	});
};

// Check what has changed
db.connect(function (conn) {
	gettingPromise('temp').then(function (last_temp) {
		if (last_temp.getMinutes() !== _now.getMinutes()) {
			_newTemp.minute = true;

			if (last_temp.getHours() !== _now.getHours()) {
				_newTemp.hour = true;

				if (last_temp.getDate() !== _now.getDate()) {
					_newTemp.day = true;
				}
			}
		}
	});

	gettingPromise('load').then(function (last_load) {
		if (last_load.getMinutes() !== _now.getMinutes()) {
			_newLoad.minute = true;

			if (last_load.getHours() !== _now.getHours()) {
				_newLoad.hour = true;

				if (last_load.getDate() !== _now.getDate()) {
					_newLoad.day = true;
				}
			}
		}
	});
});

client.getcommand(cputemp_re, cputemp_str).then(function (result_get) {
	db.insert('temp', result_get).then(function (result) {}, function (err) {});
	console.log(result_get);
}, function (err_get) {
	console.log(err_get);
});

/**
 * Gets the CPU Load frmo the client.getcommand function and inserts that
 * to the database
 *
 * TODO: Check if the minute/hour/day-value is the same. If not calc and insert average.
 */
client.getcommand(cpuload_re, cpuload_str).then(function (result_get) {
	db.insert('load', result_get).then(function (result) {}, function (err) {});
	console.log(result_get);
}, function (err_get) {
	console.log(err_get);
});
