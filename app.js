// Back-end stuff
// Created by Fredrik A. Madsen-Malmo

// Imports
var express = require('express');
var db = require('./db.js');

// Create app
var app = express();
app.set('view engine', 'jade');
app.use(express.static('public'));

// Routes

// POST: Get the 20 last values from either temp or load.
app.get('/realtime/:mode', function (req, res) {
    db.realtime(req.params.mode).then(function (result) {
        res.send(result);
    }, function (err) {
        res.send(err);
    });
});

// POST: Get the 20 last average minute temps or loads
app.get('/minute/:mode', function (req, res) {
    db.minute(req.params.mode).then(function (result) {
        res.send(result);
    }, function (err) {
        res.send(err);
    });
});

// POST: Get the 10 last average hour temps or loads
app.get('/hour/:mode', function (req, res) {
    db.hour(req.params.mode).then(function (result) {
        res.send(result);
    }, function (err) {
        res.send(err);
    });
});

// POST: Get the 7 last average day temps or loads
app.get('/day/:mode', function (req, res) {
    db.day(req.params.mode).then(function (result) {
        res.send(result);
    }, function (err) {
        res.send(err);
    });
});

// Index route
app.get('/', function (req, res) {
    db.realtime('temp').then(function (result) {
        res.render('index', { title: result[0][1] + 'C' });
    }, function (err) {
        res.render('index', { title: '-C' });
    });
});

// Settings
var PORT = process.env.PORT | 3000;

// Server
var server = app.listen(PORT, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Server is listening on http://%s:%s', host, port);
});
