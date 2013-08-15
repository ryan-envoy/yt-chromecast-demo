'use strict';

/* Services */

angular.module('chromecastDemo.services',[]).factory('YtApi', ['appConfig','$http', function(cfg,$http){
    var api = "https://www.googleapis.com/youtube/v3/";
    var _params = {
        key: cfg.youtubeKey
    };

    var yt_resource = {"api":api};

    yt_resource.search = function(query, parameters) {
        var config = {
            params: angular.extend(angular.copy(_params), {maxResults: 10, part: "snippet",type: "video"}, parameters)
        };
        return $http.get(api + "search?q=" + query, config);
    };

    return yt_resource;
}]);
