// Angular stuff
// Made by Fredrik A. Madsen-Malmo

var app = angular.module('server-status-remake', []);

app.controller('main', ['$scope', function ($scope) {
    $scope.temp = 10;
    $scope.comp_name = 'undefined';
    $scope.uptime = '42 minutes';
}]);
