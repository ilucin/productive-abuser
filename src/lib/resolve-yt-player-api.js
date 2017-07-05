let isYouTubeIframeApiReady = false;
let promiseResolve;

window.onYouTubeIframeAPIReady = function() {
  console.log('onYouTubeIframeAPIReady');
  isYouTubeIframeApiReady = true;
  promiseResolve(window.YT);
};

export default function resolveYtPlayerAPI() {
  return new Promise((resolve, reject) => {
    if (!isYouTubeIframeApiReady) {
      const el = document.createElement('script');
      el.src = 'https://www.youtube.com/player_api';
      el.onerror = reject;
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(el, firstScriptTag);
      promiseResolve = resolve;
    } else {
      resolve(window.YT);
    }
  });
}
