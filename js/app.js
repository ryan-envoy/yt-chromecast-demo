'use strict';

angular.module('chromecastDemo', ['chromecastDemo.config','chromecastDemo.services','chromecastDemo.directives','youtube.api.directives','youtube.api.services','ui.bootstrap','ngRoute']).
  config(['$routeProvider','$httpProvider','$locationProvider',function($routeProvider,$httpProvider,$locationProvider) {
    $routeProvider.when('/trending-tv', {templateUrl: 'partials/trending-tv.html', controller: 'TVCtrl'})
    .otherwise({templateUrl: 'partials/index_partial.html'});
    $httpProvider.defaults.useXDomain = true;
  }]);
