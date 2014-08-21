function ReeiverCtrl($scope,$rootScope,$window,$http,$log,ytplayer,cfg) {
	$scope.playing=false;
	var player,channel;
	ytMessages={
		"loadVideo": function(event) {
			bindFbData(event.message.videoId);
			player.cueVideoById(event.message.videoId);
		},
		"stopCasting": function() {
			endcast();
		},
		"playVideo": function() {
			player.playVideo();
		},
		"pauseVideo": function() {
			player.pauseVideo();
		},
		"stopVideo": function() {
			player.stopVideo();
		},
		"getStatus": function() {
			channel.send({'event':'statusCheck','message':player.getPlayerState()});
		}
	};

	function onYouTubeIframeAPIReady() {
		$('#splash').html("");
       		$scope.player = new YT.Player('player', {
			height: 562,
			width: 1000,
			playerVars: { 'autoplay': 0, 'controls': 0 },
          		events: {
				'onReady': onPlayerReady,
				'onStateChange': onPlayerStateChange
          		}
       		});
	}

	function bindFbData(id) {
		var topics=[];
		$.get("https://www.googleapis.com/youtube/v3/videos?part=topicDetails,contentDetails&id="+id+"&key="+cfg.youtubeKey,function(ytdata) {
			var duration=ytdata['items'][0]['contentDetails']['duration'].replace(/PT(\d+)M(\d+)S/, "$1:$2");
			for (i=0;i<ytdata['items'][0]['topicDetails']['topicIds'].length; i++) {
			$.get('https://www.googleapis.com/freebase/v1/topic/'+ytdata['items'][0]['topicDetails']['topicIds'][i]+'?lang=en&key='+cfg.freebaseKey,function(fbdata) {
				topics.push(fbdata.property["/common/topic/description"].values[0].value.split(".")[0]+".");
			});
		};
		arr=duration.split(':');
		interval=(parseInt(arr[0])*60+parseInt(arr[1]))/topics.length;
		i=0;
		setInterval(function() {
			if (player.getCurrentTime()>i*interval && i < topics.length) {
				$("#annotation").html(topics[i]);
				i++;
			}
		},333);
	});
}

function onPlayerReady() {
	setInterval(function() {
		channel.send(JSON.stringify({"messageType":"updateTime","message":player.getCurrentTime()}));
	},1000);
}

function onPlayerStateChange(event) {
	channel.send(JSON.stringify({"messageType":"stateChange","message":event.data.toString()}));
	if (event.data==YT.PlayerState.ENDED) {
		endcast();
	}
}

function onMessage(event) {
	ytMessages[event.message.type](event);
    }

function endcast() {
	setTimeout(window.close, 2000);		
}

function addMessageChannel() {
	var customMessageBus = window.castReceiverManager.getCastMessageBus("urn:x-cast:io.digitalhumanities");
	window.castReceiverManager.onSenderConnected = function(event) {
		channel=customMessageBus.getCastChannel(event.data);
		channel.onMessage = function(data) {
			msg=JSON.parse(data.message);
			ytMessages[msg.messageType](msg.message); // when getting a message from the sender, execute corresponding function
		};
		var sender=channel.getSenderId();
		channel.send(JSON.stringify({"messageType":"playerLoaded","message":sender}));
	};
}

ReceiverCtrl.$inject = ['$scope', '$rootScope', '$window','$http','$log','youtubePlayer','appConfig'];
