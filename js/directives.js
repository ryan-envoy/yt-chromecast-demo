'use strict';

/* Directives */

angular.module('chromecastDemo.directives', []).directive('chromecast',function() {
  return {
	  restrict: 'E',
	  link: function(scope,element,attrs) {
	    scope.appId=attrs['appid'];
	  }
  };
})
.directive('ytvidList',function() {
  
});
