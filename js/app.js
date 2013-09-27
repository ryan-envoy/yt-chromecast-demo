'use strict';

angular.module('chromecastDemo', ['chromecastDemo.config','chromecastDemo.services','ui.bootstrap','ngRoute']).
  config(['$routeProvider','$httpProvider','$locationProvider',function($routeProvider,$httpProvider,$locationProvider) {
    $routeProvider.when('/sender', {templateUrl: 'partials/sender.html', controller: 'SenderCtrl'})
    .when('/sender-for-receiver', {templateUrl: 'partials/sender_for_receiver.html', controller: 'SenderForReceiverCtrl'})
    .otherwise({templateUrl: 'partials/index_partial.html'});
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    //$locationProvider.html5Mode(true).hashPrefix('!');
  }]);
