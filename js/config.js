'use strict';

if(CHROMECASTDEMO_CONFIG === undefined) {
  var CHROMECASTDEMO_CONFIG = angular.module('chromecastDemo.config', []).
  factory('appConfig', ['youtubeKey','traktKey','freebaseKey','chromecastDevice','appId','msgNamespace',function(youtubeKey,traktKey,freebaseKey,chromecastDevice,appId,msgNamespace) {
    return {
      youtubeKey: youtubeKey,
      traktKey: traktKey,
      freebaseKey: freebaseKey,
      appId: appId,
      chromecastDevice: chromecastDevice,
      msgNamespace: msgNamespace
    };
  }]);
}

CHROMECASTDEMO_CONFIG.
  value('youtubeKey', 'YOUR_YOUTUBE_KEY').
  value('traktKey', 'YOUR_TRAKT_KEY').
  value('freebaseKey', 'YOUR_FREEBASE_API_KEY').
  value('chromecastDevice', 'NAME_YOU_GAVE_YOUR_CHROMECAST').
  value('msgNamespace','YOUR_NAMESPACE_FOR_MESSAGES'); // in the form com.example.www
