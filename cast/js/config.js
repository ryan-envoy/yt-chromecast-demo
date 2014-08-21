'use strict';

if(CHROMECASTDEMO_RECEIVER_CONFIG === undefined) {
  var CHROMECASTDEMO_RECEIVER_CONFIG = angular.module('chromecastDemo.receiver.config', []).
  factory('appConfig', ['youtubeKey','msgNamespace',function(youtubeKey,msgNamespace) {
    return {
      youtubeKey: youtubeKey
      msgNamespace: msgNamespace
    };
  }]);
}

CHROMECASTDEMO_RECEIVER_CONFIG.
  value('youtubeKey', 'YOUR_YOUTUBE_KEY').
  value('msgNamespace','YOUR_NAMESPACE_FOR_MESSAGES'); // in the form com.example.www
