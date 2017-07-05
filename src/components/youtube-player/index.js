import {h, Component} from 'preact';
import s from './style';

export default class YoutubePlayer extends Component {
  componentDidMount() {
    this.props.getYtPlayerAPI().then((YT) => {
      this.YT = YT;
      this.initYtPlayer(YT);
    });
  }

  componentWillUnmount() {
    this.ytPlayer.destroy();
  }

  initYtPlayer(YT) {
    this.ytPlayer = new YT.Player('youtube-player', {
      height: '390',
      width: '640',
      events: {
        onStateChange: (...args) => this.onYtPlayerStateChange(...args),
        onError: (...args) => this.onYtPlayerError(...args)
      }
    });

    this.props.registerController({
      play: () => this.ytPlayer.playVideo(),
      stop: () => this.ytPlayer.stopVideo(),
      ytPlayerCall: (method, args) => this.ytPlayer[method](...args),
      isPlaying: () => this.isPlaying,
      loadVideoByUrl: (url) => {
        this.ytPlayer.loadVideoById(url.split('v=')[1]);
        this.isPlaying = true;
      }
    });
  }

  onYtPlayerStateChange(ev) {
    const state = ev.data;
    const {YT} = this;
    this.isPlaying = (state === YT.PlayerState.PLAYING || state === YT.PlayerState.BUFFERING);

    if (state === YT.PlayerState.ENDED) {
      this.props.onPlaybackEnd();
    }
  }

  onYtPlayerError() {
    this.isPlaying = false;
  }

  render() {
    return (
      <div class={s.youtubePlayer}>
        <div id='youtube-player' class={s.youtubePlayer_player} />
      </div>
    );
  }
}
