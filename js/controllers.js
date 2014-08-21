'use strict';

/* Controllers */

function CastCtrl($scope, $rootScope, $window, $http, $log, ytdataapi, cfg) {

  $scope.playing=false;
  $scope.videoId;

  $scope.$on('triggerCast',function(msg) {
	doLaunch(msg.targetScope.qry);
  });


  $window['__onGCastApiAvailable'] = function(loaded, errorInfo) {
    $log.debug("Cast extension loaded");
    if (loaded) {
      $scope.initializeCastApi();
    } else {
      $log.error(errorInfo);
    }
  };

  $scope.initializeCastApi = function() {
    $log.debug("initializing...");
    var sessionRequest = new chrome.cast.SessionRequest(cfg.appId);
    var apiConfig = new chrome.cast.ApiConfig(sessionRequest,
      $scope.sessionListener,
      $scope.receiverListener);
    chrome.cast.initialize(apiConfig, $scope.onInitSuccess, $scope.onError);
  };

  $scope.onInitSuccess = function() {
    $log.log("Chromecast initialized");
  };

  $scope.onError = function() {
    $log.error("Something went wrong");
  };

  $scope.receiverListener = function(e) {
    if( e === chrome.cast.ReceiverAvailability.AVAILABLE) {
      $log.log("Receiver available");
    }
  };

  var doLaunch = function(qry) {
	$scope.videoId=qry;
	chrome.cast.requestSession(onRequestSessionSuccess, onLaunchError);
  };

  var onRequestSessionSuccess = function(e) {
	$scope.cast_session = e;
	$scope.cast_session.sendMessage(cfg.msgNamespace,{"type":"setChannel"});
	$scope.cast_session.addMessageListener(cfg.msgNamespace,function(msg) {
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
        	$scope.cast_session.sendMessage(cfg.msgNamespace,{"type":"loadVideo","videoId":$scope.videoId});
 	}
      });
      $log.log($scope.cast_session);
  }

  $scope.ytPlaybackCmd = function(message) {
    $scope.cast_session.sendMessage(cfg.msgNamespace,{"type":message});
  };

  $rootScope.passMessage = function(message) {
	$scope.ytPlaybackCmd(message);
  }

}
function TVCtrl($scope,$rootScope,$http,$modal,$log,ytdataapi,traktapi,freebaseapi,cfg) {
  $scope.trending = function() {
	 $scope.toptv=[];
	 traktapi.trending().success(function(apiresults) {
		angular.forEach(apiresults.slice(0,18),function(v,k) {
      			$scope.toptv.push(v);
		});
	 });
  };

  $scope.showDetails = function(idx) {
    $log.log(idx);
    var modalParams={
	"$log": function() {
		return $log;
	},
	"show":function() {
		return $scope.toptv[idx];
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

function ShowDetailCtrl($scope, $modalInstance, $log, show, fb, yt, rootScope){
  
  $scope.cancel = function(){
    $modalInstance.close();
    rootScope.passMessage('stopCasting');
  };

  $scope.disconnect = function() {
	$scope.casting=false;
  }
  
  $scope.casting=false;
  $scope.show=show;
  $log.log($scope.show);
  $scope.freebaseSearch=function() {
  	fb.search($scope.show.title).success(function(data) {
		if (data.result.length) {
			$scope.casting=true;
  			yt.search({"q":"trailer","part":"id","maxResults":1,"topicId":data.result[0].mid,"type":"video"}).success(function(apiresults) {
				$scope.qry=apiresults.items[0].id.videoId;
				$scope.$broadcast('triggerCast');
			});
		}
		else {
			alert("No Freebase results were found for this show");
		}
  	});
  };
}

CastCtrl.$inject = ['$scope','$rootScope','$window','$http','$log','youtubeData','appConfig'];
TVCtrl.$inject = ['$scope','$rootScope','$http','$modal','$log','youtubeData','TraktApi','FreebaseApi','appConfig'];
