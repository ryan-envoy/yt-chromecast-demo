'use strict';

/* Controllers */

function SenderCtrl($scope, $window, api) {
  $scope.ytSearch = function(character) {
  	api.search(character,{'channelId':'UCNcdbMyA59zE-Vk668bKWOg'}).success(function(apiresults) {
  		$scope.video=apiresults.items[Math.floor(Math.random()*apiresults.items.length)];
    		doLaunch();
	});
  };
  
  var cast_api;
  $scope.receivers = [];
  $scope.appId = "YouTube";

  var initializeApi = function() {
    cast_api = new cast.Api();
    cast_api.addReceiverListener($scope.appId, onReceiverList);
  };

  var onReceiverList = function(list) {
    var receiver_to_play="{THE NAME YOU GAVE YOUR CHROMECAST DEVICE}";
    angular.forEach(list,function(v,k) {
	if (v.name==receiver_to_play) {
		$scope.receiver=v;
	}
    });
    $scope.$apply();
  };

  var doLaunch = function() {
    var lr = new cast.LaunchRequest($scope.appId, $scope.receiver);
    lr.parameters = "v="+$scope.video.id.videoId;
    lr.description = new cast.LaunchDescription();
    lr.description.text = $scope.video.snippet.title;
    lr.description.url = "http://youtu.be/"+$scope.video.id.videoId;
    cast_api.launch(lr, onLaunch);
  };

  var onLaunch = function(activity) {
	console.log("cast");
  };

  $window.addEventListener("message", function(event) {
    if (event.source == window && event.data && event.data.source == "CastApi" && event.data.event == "Hello") {
      initializeApi();
    }
  });

  if (typeof $window.cast !== "undefined" && $window.cast.isAvailable) {
    initializeApi();
  }

}

SenderCtrl.$inject = ['$scope','$window','YtApi'];
