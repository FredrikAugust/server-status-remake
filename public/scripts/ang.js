// Angular stuff
// Made by Fredrik A. Madsen-Malmo

var app = angular.module('server-status-remake', []);

app.controller('main', ['$scope', '$http', function ($scope, $http) {
	$scope.pulled = new Date().toLocaleString();

	// Refresh function
	$scope.refresh_graphs = function () {
		$http({
			method: 'GET',
			url: '/refresh'
		}).success(function (data, status) {
			console.log('Creating new graphs.');
		}).error(function (data, status) {
			console.log('Could not create new graphs.');
		});
	};

	// img-names
	$http({
		method: 'GET',
		url: '/images'
	}).success(function (data, status) {
		console.log(data);
		$scope.images = data;
	}).error(function (data, status) {
		console.log('Could not create an array of image names.');
		$scope.images = [];
	});

	// Memory stats
	$http({
		method: 'GET',
		url: '/memory'
	}).success(function (data, status) {
		$scope.mem = data;
	}).error(function (data, status) {
		$scope.mem = [];
	});

	// Current temperature
	$http({
		method: 'GET',
		url: '/temp'
	}).success(function (data, status) {
		$scope.temp = parseFloat(data / 10).toFixed(2);
	}).error(function (data, status) {
		$scope.temp = 0;
		return new Error('Could not retrieve current temp.');
	});

	// Current CPU load
	$http({
		method: 'GET',
		url: '/load'
	}).success(function (data, status) {
		$scope.load = parseFloat(data).toFixed(2);
	}).error(function (data, status) {
		$scope.load = 0;
		return new Error('Could not retrieve current load.');
	});

	// Network up and down
	$http({
		method: 'GET',
		url: '/network'
	}).success(function (data, status) {
		console.log(data, status);
		$scope.down = String((data[0] / 1000000000).toFixed(1)) + ' GB';
		$scope.up = String((data[1] / 1000000000).toFixed(1)) + ' GB';
	}).error(function (data, status) {
		$scope.down = 0;
		$scope.up = 0;
		return new Error('Could not retrieve current network data.');
	});

	// Drives
	$http({
		method: 'GET',
		url: '/drive'
	}).success(function (data, status) {
		$scope.drives = data;
	}).error(function (data, status) {
		$scope.drives = [[0,0,0,0,0],
						[0,0,0,0,0]];
		return new Error('Could not retrieve current drive data.');
	});

	// Hostname
	$http({
		method: 'GET',
		url: '/hostname'
	}).success(function (data, status) {
		$scope.comp_name = data;
	}).error(function (data, status) {
		$scope.comp_name = 'unknown';
		return new Error('Could not retrieve current hostname data.');
	});

	// Uptime
	$http({
		method: 'GET',
		url: '/uptime'
	}).success(function (data, status) {
		$scope.uptime = data;
	}).error(function (data, status) {
		$scope.comp_name = '0 min';
		return new Error('Could not retrieve current uptime data.');
	});
}]);
