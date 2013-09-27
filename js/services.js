'use strict';

/* Services */

angular.module('chromecastDemo.services',[])
.factory('YtDataApi', ['appConfig','$http', function(cfg,$http){
    var _params = {
        key: cfg.youtubeKey
    };
    var endpoints = ["activities","channels","guideCategories","playlistItems","playlists","search","subscriptions","videoCategories","videos"];
    var api="https://www.googleapis.com/youtube/v3/";
    var yt_resource = {"api":api};
    angular.forEach(endpoints, function(v,k) {
	yt_resource[v] = function(parameters) {
           var config = {
            params: angular.extend(angular.copy(_params), parameters)
           };
        return $http.get(api + v +"?part=snippet", config);
    	};
    });
    return yt_resource;
}])
.factory('TraktApi', ['appConfig','$http', function(cfg,$http){
    var api="http://api.trakt.tv/";
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
