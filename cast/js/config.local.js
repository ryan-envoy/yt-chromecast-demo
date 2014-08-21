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
  value('youtubeKey', 'AIzaSyCuMR0EjCMFsWfFoEk5pIAN5u8XvgVclL4').
  value('msgNamespace','io.digitalhumanities.interlacing'); // in the form com.example.www