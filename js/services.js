'use strict';

/* Services */

angular.module('chromecastDemo.services',[])
.factory('TraktApi', ['appConfig','$http', function(cfg,$http){
    var api="https://api.trakt.tv/";
    var trakt_resource = {"api":api};
    trakt_resource.trending = function() {
        return $http.jsonp(api + "shows/trending.json/" + cfg.traktKey+"?callback=JSON_CALLBACK");  
    };
    return trakt_resource;
}])
.factory('FreebaseApi', ['appConfig','$http', function(cfg,$http) {
    var api="https://www.googleapis.com/freebase/v1/";
    var fb_resource = {"api":api};
    fb_resource.search = function(query) {
        return $http.get(api + "search?query=" + query+"&key="+cfg.freebaseKey+"&exact=true&filter=(any type:/tv/tv_program)");  
    };
    return fb_resource;
}]);
