# Remake of @Tijndagamer's "_Server Status_" page.

## Description

As the last version I made was insecure, dysfunctional, badly optimized and in general quite bad I decided to remake the entire project, this time featuring semi-good code.

The project is built using **angular.js** for front-end, **express.js** for back-end and **highcharts.js** for the graphs. I might add more stuff later, but this is all for now. Please notify me if I forgot to add something here.

## Installation

* Go to the root dir and run `npm install`
* Make sure you have `mongodb` installed
    - If not; look [here](https://www.mongodb.org/)
* Now you should be good to go; look under usage for how to use the thing

## Usage

Type `nodejs app.js`, and then open a second tab and type `bash loop.sh`.

If you want to change the PORT please follow the instructions below.

1. Create a file called `.env` in the root dir of the repo.
2. Inside that file, write `PORT=<port>` where you replace _<port>_ with whatever you want as the port. E.g. `PORT=666`.

## Reset

1. Open a new terminal and enter `mongo`
2. Type `use serverstatus`
3. Enter `db.temp.remove({})`
4. Enter `db.load.remove({})`

You have now removed all entries from the database.

## TODO

- ~~Add Night mode~~
- ~~Make daily graph average over whole day~~
- ~~Make hour graph average over whole hour~~
- ~~Display uptime~~
- ~~Display time & date when the information was retrieved~~
- CPU load bar
- ~~Network stats~~
- ~~Memory stats~~
- ~~Memory bar~~
- ~~Drive stats~~
- Auto refresh the page every minute

_'Kinda like [this](https://lh5.googleusercontent.com/-yvvO2xzXEzI/VbEtV6jgiTI/AAAAAAAAAVw/NTlSChaSJkk/w1111-h865-no/2015-07-23.png) and [this](https://lh5.googleusercontent.com/-csIi1eDTj6U/VbEtWjCi0PI/AAAAAAAAAV4/GJch_n4Rr-4/w1070-h865-no/2015-07-23.png)._
_~ @Tijndagamer_
