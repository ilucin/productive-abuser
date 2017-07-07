let isYouTubeIframeApiReady = false;
let promiseResolve;

if (typeof window !== 'undefined') {
  window.onYouTubeIframeAPIReady = function() {
    isYouTubeIframeApiReady = true;
    promiseResolve(YT);
  };
}

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
      resolve(YT);
    }
  });
}
