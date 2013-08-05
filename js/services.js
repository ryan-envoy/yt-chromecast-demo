'use strict';

/* Services */

angular.module('chromecastDemo.services',[]).factory('YtApi', ['$http', function($http){
    var api = "https://www.googleapis.com/youtube/v3/";
    var _params = {
        key: '{YOUR YT_API KEY HERE}'
    };

    var yt_resource = {"api":api};

    yt_resource.search = function(query, parameters) {
        var config = {
            params: angular.extend(angular.copy(_params), {maxResults: 10, part: "snippet"}, parameters)
        };
        return $http.get(api + "search?q=" + query, config);
    };

    return yt_resource;
}]);
