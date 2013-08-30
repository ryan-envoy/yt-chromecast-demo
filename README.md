yt-chromecast-demo
==================

Demo apps for integrating YouTube APIs with Chromecast. The sender app presents a selection of images, each associated with a phrase -- when an image is clicked, that phrase is searched for using the YouTube APIs, a random video is selected from the results, and it is sent to a Chromecast device.

To get demo to function, you'll need to do a few things:

1) create a js/config.local.js file (based on the config.js template) which includes your YouTube API key and the name of the Chromecast device you're trying to cast to.
2) whitelist, in your browser extension, the domain you've loaded the sender app on to.
