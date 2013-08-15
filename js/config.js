/**
  Contains configuration data for connecting to the API.
  
  WARNING: Do not modify this file directly. Make a copy of it into
  config.local.js instead. Any identical constant names in config.local.js
  will override those of this configuration.
**/
'use strict';

if(CHROMECASTDEMO_CONFIG === undefined) {
  var CHROMECASTDEMO_CONFIG = angular.module('chromecastDemo.config', []).
  factory('appConfig', ['youtubeKey', 'chromecastDevice', function(youtubeKey,chromecastDevice) {
    return {
      youtubeKey: youtubeKey,
      chromecastDevice: chromecastDevice
    };
  }]);
}

CHROMECASTDEMO_CONFIG.
  value('youtubeKey', 'your key here').
  value('chromecastDevice', 'name of your device');
