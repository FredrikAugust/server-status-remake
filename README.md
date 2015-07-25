# Remake of @Tijndagamer's "_Server Status_" page.

## Description

As the last version I made was insecure, dysfunctional, badly optimized and in general quite bad I decided to remake the entire project, this time featuring semi-good code.

The project is built using **angular (js)** for front-end, **express (js)** for back-end and **highcharts (js)** for the graphs. I might add more stuff later, but this is all for now. Please notify me if I forgot to add something here.

## Installation

* Make sure `foreman` is installed
    - If not; look [here](http://theforeman.org/manuals/1.8/#2.1Installation)
* Go to the root dir and run `npm install`
* Make sure you have `mongodb` installed
    - If not; look [here](https://www.mongodb.org/)
* Make sure you have `python` 2.x installed
* Now you should be good to go; look under usage for how to use the thing

## Usage

To start the website go to the root folder type `mongod`, open a new tab and type `nodejs app.js`, and then open a third and type `python loop.py`.

## TODO

- ~~Add Night mode~~
- ~~Make daily graph average over whole day~~
- ~~Make hour graph average over whole hour~~
- ~~Display uptime~~
- Display time & date when the information was retrieved
- CPU load bar
- ~~Network stats~~
- Memory stats
- Memory bar
- ~~Drive stats~~

_'Kinda like [this](https://lh5.googleusercontent.com/-yvvO2xzXEzI/VbEtV6jgiTI/AAAAAAAAAVw/NTlSChaSJkk/w1111-h865-no/2015-07-23.png) and [this](https://lh5.googleusercontent.com/-csIi1eDTj6U/VbEtWjCi0PI/AAAAAAAAAV4/GJch_n4Rr-4/w1070-h865-no/2015-07-23.png)._
_~ @Tijndagamer_
