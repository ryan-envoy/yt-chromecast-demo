'use strict';

/* Controllers */

function SenderCtrl($scope, $rootScope, $window, $http, ytdataapi, cfg) {
  $scope.receiver_to_play=cfg.chromecastDevice;

  $scope.$on('triggerSearch',function(msg) {
	$scope.ytSearch({"q":msg.targetScope.qry,"maxResults":3,"type":"video"});
  });

  $scope.ytSearch = function(api_params) {
  	ytdataapi.search(api_params).success(function(apiresults) {
  		$scope.video=apiresults.items[Math.floor(Math.random()*apiresults.items.length)];
    		doLaunch();
	});
  };

  $scope.receivers = [];
  if (!$scope.appId||$scope.appId=="default") {
  	$scope.appId = cfg.appId;
  }

  var initializeApi = function() {
    $scope.cast_api = new cast.Api();
    $scope.cast_api.addReceiverListener($scope.appId, onReceiverList);
  };

  var onReceiverList = function(list) {
    angular.forEach(list,function(v,k) {
	if (v.name==$scope.receiver_to_play) {
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
    $scope.cast_api.launch(lr, onLaunch);
  };

  $scope.playing=false;

  var onLaunch = function(activity) {
	 $scope.activity=activity;
	 if ($scope.appId!="YouTube") {
	        $scope.cast_api.sendMessage($scope.activity.activityId,cfg.msgNamespace,{"type":"setChannel"});
	        $scope.cast_api.addMessageListener($scope.activity.activityId,cfg.msgNamespace,function(msg) {
        	        if (msg.event=="stateChange") {
				switch(msg.message) {
					case 1:
					case 3:
						$scope.playing=true;
						break;
					case -1:
					case 0:
					case 2:
					case 5:
						$scope.playing=false;
						break;
				}
				$scope.$apply();
	                }
                  	else if (msg.event=="iframeApiReady") {
                    		$scope.cast_api.sendMessage($scope.activity.activityId,cfg.msgNamespace,{"type":"loadVideo","videoId":$scope.video.id.videoId});
 			}
	       	});
	 }
  };

  $scope.ytPlaybackCmd = function(message) {
    if (!$scope.activity.activityId) {
      return;
    }
    $scope.cast_api.sendMessage($scope.activity.activityId,cfg.msgNamespace,{"type":message});
  };

  $rootScope.passMessage = function(message) {
	$scope.ytPlaybackCmd(message);
  }

  $window.addEventListener("message", function(event) {
    if (event.source == window && event.data && event.data.source == "CastApi" && event.data.event == "Hello") {
      initializeApi();
    }
  });

  if (typeof $window.cast !== "undefined" && $window.cast.isAvailable) {
    initializeApi();
  }
}

function SenderForReceiverCtrl($scope,$rootScope,$http,$modal,ytdataapi,traktapi,freebaseapi,cfg) {
  $scope.trending = function() {
	 $scope.topten=[];
	 traktapi.trending().success(function(apiresults) {
		angular.forEach(apiresults.slice(0,18),function(v,k) {
      			$scope.topten.push(v);
		});
	 });
  };

  $scope.showDetails = function(idx) {
    var modalParams={
	"show":function() { 
		return $scope.topten[idx];
	},
	"fb":function() { 
		return freebaseapi; 
	},
	"yt": function() {
		return ytdataapi;
	},
	"rootScope": function() {
		return $rootScope;
	}
    }

    var modalInstance = $modal.open({ templateUrl: "partials/show-detail.html", controller: 'ShowDetailCtrl', resolve: modalParams});
  };
  
}

function ShowDetailCtrl($scope, $modalInstance, show, fb, yt, rootScope){
  $scope.cancel = function(){
    $modalInstance.close();
    rootScope.passMessage('stopCasting');
  };
  $scope.casting=false;
  $scope.show=show;
  $scope.freebaseSearch=function() {
  	fb.search($scope.show.title).success(function(data) {
		if (data.result.length) {
			$scope.casting=true;
  			yt.search({"maxResults":1,"topicId":data.result[0].mid,"type":"video"}).success(function(apiresults) {
				$scope.qry=apiresults.items[0].id.videoId;
				$scope.$broadcast('triggerSearch');
			});
		}
		else {
			alert("No Freebase results were found for this show");
		}
  	});
  };
}

SenderCtrl.$inject = ['$scope','$rootScope','$window','$http','YtDataApi','appConfig'];
SenderForReceiverCtrl.$inject = ['$scope','$rootScope','$http','$modal','YtDataApi','TraktApi','FreebaseApi','appConfig'];
