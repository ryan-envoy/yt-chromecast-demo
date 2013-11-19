yt-chromecast-demo
==================

This is a pair of demo apps for integrating YouTube APIs with Chromecast. It is designed for developers who are learning about the Chromecast SDK or YouTube APIs, or for those wishing to run a code lab on various Google technologies (in addition to YouTube and Chromecast, the demos also incorporate Freebase searching and AngularJS).

The first demo app is a sender-only app. It is designed to present a selection of images, each associated with a phrase -- when an image is clicked, that phrase is searched for using the YouTube APIs, a random video is selected from the results, and it is sent to a Chromecast device using the stock YouTube receiver. To get this first demo to function, you'll need to do a few things:

1) Create a js/config.local.js file (based on the js/config.js template) which includes your YouTube API key and the name of the Chromecast device you're trying to cast to.
2) Place the app on a domain that you have access to and that runs an actual web server (i.e. not the file:// protocol)
3) Whitelist, in your browser extension, the domain you've loaded the sender app on to.
4) You can override the appID that you set in your config file with the <chromecast appid="{new_app_id}"/> directive

Once you've done these steps, you should be able to visit the app in your browser (make sure the computer that you're on is located on the same network as the device you're trying to cast to) and choose the "sender-only" demo, and run it.

The second demo app combines a custom sender with a custom receiver. It starts off by making a call to the Trakt API (for getting real-time trending info about television shows) and then presents a list of choices. Clicking on one will do a freebase call to get a freebase topic ID, followed by a Youtube API search based on that topic ID. It will then display a modal popup allowing the user to cast to the custom receiver. 

The Chromecast, upon receiving the cast request, will load in the custom receiver app -- this app then generates an open channel with the sender app so that messages (loading the YouTube Video via the YouTube player API, adding in annotations via another Freebase search, setting up event handlers for player status updates, etc.) can go back and forth.

To get this second app ready, you must do the following:

1) Create a js/config.local.js file (based on the js/config.js template) which includes your YouTube API key, your Freebase API key, your Trakt API key, your whitelisted app_id (see the online Chromecast docs for more details), a namespace of your choosing (for the passing of messages between sender and receiver), and the name of the Chromecast device you're trying to cast to.
2) Create a second config file -- this one at receiver_app/js/config.local.js (based on the receiver_app/js/config.js template) which includes your YouTube API key, your Freebase API key, your app ID, and your namespace. 
3) Place the app on a domain that you have access to and that runs an actual web server (i.e. not the file:// protocol). Make sure that the receiver app is resolvable by the URL that you submitted to the app_id whitelisting process (it must match EXACTLY) and that the sender and receiver are at different URLs.
4) Whitelist, in your browser extension, the domain you've loaded the sender app on to.
5) You can override the appID that you set in your config file with the <chromecast appid="{new_app_id}"/> directive

Once you've done these steps, you should be able to visit the app in your browser (make sure the computer that you're on is located on the same network as the device you're trying to cast to) and choose the "sender for receiver" demo, and run it.
