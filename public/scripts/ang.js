// Angular stuff
// Made by Fredrik A. Madsen-Malmo

var app = angular.module('server-status-remake', []);

app.controller('main', ['$scope', '$http', function ($scope, $http) {
	// Current temperature
	$http({
		method: 'GET',
		url: '/realtime/temp'
	}).success(function (data, status) {
		$scope.temp = data[0][1];
	}).error(function (data, status) {
		$scope.temp = 0;
		return new Error('Could not retrieve current temp.');
	});

	// Current CPU load
	$http({
		method: 'GET',
		url: '/realtime/load'
	}).success(function (data, status) {
		$scope.load = data[0][1];
	}).error(function (data, status) {
		$scope.load = 0;
		return new Error('Could not retrieve current load.');
	});

	// Network up and down
	$http({
		method: 'GET',
		url: '/network'
	}).success(function (data, status) {
		$scope.down = data[0];
		$scope.up = data[1];
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

    $scope.renderChart = function (mode, time) {
    	$http({
    		method: 'GET',
    		url: '/' + time + '/' + mode
    	}).success(function (data, status) {
    		var x = [],
    			y = [];

    		data.forEach(function(element) {
				x.unshift(element[0]);
				y.unshift(parseFloat(element[1].toFixed(1)));
			});

			$('.' + mode + 'plot').highcharts({
				chart: {
		            type: 'line',
		            backgroundColor: '#2b3e50',
		            borderColor: '#fff',
		            borderWidth: 1

		        },
		        title: {
		        	useHTML: true,
		        	text: '<h3>' + ((mode == 'temp' && 'Temperature') || 'CPU Load') + '</h3>',
		        	style: {
		        		color: '#ebebeb'
		        	}
		        },
		        subtitle: {
		        	text: ((time != 'realtime' && 'Average ') || '') + time[0].toUpperCase() + time.substr(1),
		        	style: {
		        		color: '#ecf0f1'
		        	}
		        },
		        xAxis: {
		        	categories: x,
		        	labels: {
		        		style: {
		        			color: '#ecf0f1'
		        		}
		        	}
		        },
		        yAxis: {
		        	title: {
		        		text: (mode == 'temp' && 'Temperature (\xb0C)') || 'CPU Load (%)',
		        		style: {
		        			color: '#ecf0f1'
		        		}
		        	},
		        	labels: {
		        		style: {
		        			color: '#ecf0f1'
		        		}
		        	}
		        },
		        plotOptions: {
		            line: {
		                dataLabels: {
		                    enabled: true,
		                    style: {
		                    	color: '#ecf0f1',
		                    	textShadow: 0
		                    }
		                }
		            }
		        },
		        series: [{
		        	name: (mode == 'temp' && 'Temperature') || 'CPU Load',
		            data: y
		        }],
		        navigation: {
		        	buttonOptions: {
		        		enabled: false
		        	}
		        },
		        legend: {
		        	enabled: false
		        },
		        credits: {
		        	enabled: false
		        }
			});
    	});
    };
}]);
