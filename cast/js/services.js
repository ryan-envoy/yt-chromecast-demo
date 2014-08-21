'use strict';

/* Services */

angular.module('chromecastDemo.receiver.services',[]).factory('FreebaseApi', ['appConfig','$http', function(cfg,$http) {
    var api="https://www.googleapis.com/freebase/v1/";
    var fb_resource = {"api":api};
    fb_resource.search = function(query) {
        return $http.get(api + "search?query=" + query+"&key="+cfg.freebaseKey+"&exact=true&filter=(any type:/tv/tv_program)");  
    }; 
    fb_resource.topic = function(t) {
    	$http.get('https://www.googleapis.com/freebase/v1/topic/+t+'?lang=en&key='+cfg.freebaseKey);
    }
}]);
