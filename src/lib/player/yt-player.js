import store from '../store';

let ytPlayer;
let isYouTubeIframeApiReady = false;
let isInitCalled = false;
let isPlaying = false;

function popFromQueue() {
  const url = store.playlist[0];
  store.playlist = store.playlist.slice(1);
  return url;
}

function pushToPlaylist(url, opts) {
  const urls = Array.isArray(url) ? url : [url];

  if (opts && opts.prepend) {
    store.playlist = urls.concat(store.playlist);
  } else {
    store.playlist = store.playlist.concat(urls);
  }
}

function loadVideoByUrl(url) {
  ytPlayer.loadVideoById(url.split('v=')[1]);
  isPlaying = true;
}

function playFromQueue() {
  const url = popFromQueue();

  if (!url) {
    return;
  }

  loadVideoByUrl(url);
}

function onPlayerStateChange(ev) {
  const state = ev.data;
  isPlaying = (state === YT.PlayerState.PLAYING || state === YT.PlayerState.BUFFERING);

  if (state === YT.PlayerState.ENDED) {
    playFromQueue();
  }
}

function onPlayerError() {
  isPlaying = false;
}

function initPlayer() {
  ytPlayer = new YT.Player('yt-player', {
    height: '390',
    width: '640',
    events: {
      onStateChange: onPlayerStateChange,
      onError: onPlayerError
    }
  });
}

function init() {
  isInitCalled = true;

  if (isYouTubeIframeApiReady) {
    initPlayer();
  }
}

window.onYouTubeIframeAPIReady = function() {
  isYouTubeIframeApiReady = true;

  if (isInitCalled) {
    initPlayer();
  }
};

function playFromQueueIfNotPlaying() {
  if (!isPlaying) {
    playFromQueue();
  }
}

function play() {
  ytPlayer.playVideo();
}

function stop() {
  ytPlayer.stopVideo();
}

function ytPlayerCall(method, args) {
  ytPlayer[method](...args);
}

export default {
  init,
  pushToPlaylist,
  playFromQueue,
  playFromQueueIfNotPlaying,
  play,
  stop,
  ytPlayerCall
};
