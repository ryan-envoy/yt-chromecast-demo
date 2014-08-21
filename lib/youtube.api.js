'use strict';
/* Directives */

angular.module('youtube.api.directives',[])
.directive('youtube', ['youtubePlayer', function (YtPlayerApi) {
        return {
            restrict:'E',
            link:function (scope,element,attrs) {
                YtPlayerApi.setPlayerId(attrs.id);
                player_vars={};
                allowed_vars=["autoplay","controls","html5","listType","list"];
                for (var idx in allowed_vars) {
                    if (allowed_vars[idx] in attrs) {
                        player_vars[allowed_vars[idx]]=attrs[allowed_vars[idx]];
                    }
                }
                YtPlayerApi.setPlayerVars(player_vars);
                YtPlayerApi.setVideoId(attrs.src);
                scope.muted=attrs.muted;
            }
        };
    }]);

/* Services */

angular.module('youtube.api.services',[]).run(['$rootScope','$window',function($rootScope,$window) {
    var tag = document.createElement('script');
    tag.src = "//www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    $rootScope.$on('$viewContentLoaded',function() {
    	if (typeof YT !== 'undefined') {
    		$rootScope.$broadcast('apiReady');
    	}
    });
}]).factory('youtubePlayer', ['$window','$rootScope', function ($window, $rootScope) {
	$window.onYouTubeIframeAPIReady = function () {
		$rootScope.$broadcast('apiReady');
	};
	var ytplayer = {
		"playerId":null,
		"playerObj":null,
		"videoId":null,
		"autoplay": 0,
		"html5": 1,
		"controls": true,
		"height":390,
		"width":640,
		"listType":null,
		"list":null,

		setPlayerId:function(elemId) {
            		this.playerId=elemId;
                },
		setDimensions:function(width,height) {
	    		this.width=width;
	    		this.height=height;
		},
		setPlayerVars: function(player_vars) {
			for (var attr in player_vars) {
				this[attr]=player_vars[attr];
			};
		},
		setVideoId: function(videoId) {
			this.videoId=videoId;
		},
		loadPlayer:function (callback) {
			var playerVars={'autoplay':this.autoplay,'controls':this.controls};
			var playerConfig={'height':this.height,'width':this.width,'playerVars':playerVars,'events':{}};
			if (this.listType) {
				playerConfig.playerVars.listType=this.listType;
				playerConfig.playerVars.list=this.list;
			}
			else {
				playerConfig.videoId=this.videoId;
			}
			if (callback) {
				playerConfig.events.onReady=callback;
			}
           	this.playerObj = new YT.Player(this.playerId, playerConfig);
        },
        muteVideo: function() {
        	this.playerObj.mute();
        },
		playVideo:function() {
			this.playerObj.playVideo();
		},
		pauseVideo:function() {
			this.playerObj.pauseVideo();
		},
		stopVideo:function() {
			this.playerObj.stopVideo();
		}
	};
        return ytplayer;
    }])
    .factory('youtubeData', ['$http', 'appConfig',function($http,cfg){
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
        	return $http.get(api + v +"?", config);
        	};
    	});
    	return yt_resource;
     }]);
