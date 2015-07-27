// Back-end stuff
// Created by Fredrik A. Madsen-Malmo

// Imports
var express = require('express');
var Promise = require('promise');
var db = require('./db.js');
var client = require('./client.js');

// Create app
var app = express();
app.set('view engine', 'jade');
app.use(express.static('public'));

// Routes

// GET: Get the 20 last values from either temp or load.
app.get('/realtime/:mode', function (req, res) {
    db.realtime(req.params.mode).then(function (result) {
        res.send(result);
    }, function (err) {
        res.send(err);
    });
});

// GET: Get the 20 last average minute temps or loads
app.get('/minute/:mode', function (req, res) {
    db.minute(req.params.mode).then(function (result) {
        res.send(result);
    }, function (err) {
        res.send(err);
    });
});

// GET: Get the 10 last average hour temps or loads
app.get('/hour/:mode', function (req, res) {
    db.hour(req.params.mode).then(function (result) {
        res.send(result);
    }, function (err) {
        res.send(err);
    });
});

// GET: Get the 7 last average day temps or loads
app.get('/day/:mode', function (req, res) {
    db.day(req.params.mode).then(function (result) {
        res.send(result);
    }, function (err) {
        res.send(err);
    });
});

// Regex
var network_re = /([\s\S]+)/;
var network_down_str = "cat /sys/class/net/eth0/statistics/rx_bytes";
var network_up_str = "cat /sys/class/net/eth0/statistics/tx_bytes";

// GET: Network up and down
app.get('/network', function (req, res) {
    var resultArray = [];

    client.getcommand(network_re, network_down_str).then(function (result) {
        resultArray.push(result);

        client.getcommand(network_re, network_up_str).then(function (result2) {
            resultArray.push(result2);
            res.send(resultArray);
        }, function (err2) {
            res.send(err2);
        });
    }, function (err) {
        res.send(err);
    });
});

// GET: Drive stats
app.get('/drive', function (req, res) {
    client.drivestats().then(function (result) {
        res.send(result);
    }, function (err) {
        res.send(err);
    });
});

// GET: Hostname
app.get('/hostname', function (req, res) {
    client.getcommand(/([\s\S]*)/, 'hostname').then(function (result) {
        res.send(result);
    }, function (err) {
        res.send(err);
    });
});

// GET: Uptime
app.get('/uptime', function (req, res) {
    client.getcommand(/([\s\S]*)/, 'uptime -p').then(function (result) {
        res.send(result);
    }, function (err) {
        res.send(err);
    });
});

// GET: Memory stats
// TODO: Implement memory get route
// Take info from client.memstats()

// Index route
app.get('/', function (req, res) {
    res.render('index');
});

// Settings
var PORT = process.env.PORT || 3000;

// Server
var server = app.listen(PORT, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Listening on http://%s:%s', host, port);
});
