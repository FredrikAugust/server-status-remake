// Back-end stuff
// Created by Fredrik A. Madsen-Malmo

// Imports
var express = require('express');
var db = require('./db.js');

// Create app
var app = express();
app.set('view engine', 'jade');

// Routes
app.get('/', function (req, res) {
    db.temp_realtime().then(function (result) {
        res.send(result);
    }, function (err) {
        res.send('Error');
    });

    // res.render('index', { title: '' });
});

// Settings
var PORT = process.env.PORT | 3000;

// Server
var server = app.listen(PORT, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Server is listening on http://%s:%s', host, port);
});
