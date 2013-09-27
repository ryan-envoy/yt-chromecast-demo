	var receiver = new cast.receiver.Receiver(cfg.appId, [cfg.msgNamespace],"",5);
	var ytChannelHandler = new cast.receiver.ChannelHandler(cfg.msgNamespace);
	var channel;
	ytChannelHandler.addChannelFactory(receiver.createChannelFactory(cfg.msgNamespace));
	ytChannelHandler.addEventListener(
		cast.receiver.Channel.EventType.MESSAGE,
		onMessage.bind(this)
	);

	receiver.start();

	window.addEventListener('load', function() {
		var tag = document.createElement('script');
      		tag.src = "https://www.youtube.com/iframe_api";
      		var firstScriptTag = document.getElementsByTagName('script')[0];
      		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      	});

      	var player;
	ytMessages={
		"setChannel": function(event) {
			channel=event.target;
		},
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
        	player = new YT.Player('player', {
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
		$.ajaxSetup({'async':false});
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
		channel.send({'event':'iframeApiReady','message':'ready'});
	}

	function onPlayerStateChange(event) {
		channel.send({'event':'stateChange','message':event.data});
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
