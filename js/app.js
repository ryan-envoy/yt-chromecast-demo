'use strict';

angular.module('chromecastDemo', ['chromecastDemo.services','ui.bootstrap']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/sender', {templateUrl: 'partials/sender.html', controller: 'SenderCtrl'});
    $routeProvider.when('/receiver', {templateUrl: 'partials/receiver.html', controller: 'receiverCtrl'});
    $routeProvider.otherwise({templateUrl: 'partials/index_partial.html'});
  }]);
