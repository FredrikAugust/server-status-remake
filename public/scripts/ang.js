// Angular stuff
// Made by Fredrik A. Madsen-Malmo

var app = angular.module('server-status-remake', []);

app.controller('main', ['$scope', '$http', function ($scope, $http) {
	$http({
		method: 'GET',
		url: '/realtime/temp'
	}).success(function (data, status) {
		$scope.temp = data[0][1];
	}).error(function (data, status) {
		return new Error('Could not retrieve current temp.');
	});

    $scope.comp_name = 'undefined';
    $scope.uptime = '42 minutes';
    $scope.renderChart = function (mode, time) {
    	$http({
    		method: 'GET',
    		url: '/' + time + '/' + mode
    	}).success(function (data, status) {
    		var x = [],
    			y = [];

    		data.forEach(function(element) {
				x.push(element[0]);
				y.push(parseFloat(element[1].toFixed(1)));
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
