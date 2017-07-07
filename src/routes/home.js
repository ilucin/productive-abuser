import {h, Component} from 'preact';
import Home from '../components/home';
import config from '../lib/config';
import ProductiveAbuser from '../lib/productive-abuser';

export default class HomeRoute extends Component {
  constructor() {
    super();
    this.state = {
      message: 'Welcome to Productive Abuser',
      isLoading: true,
      connectionError: null,
      videoSrc: null,
      imageSrc: '/assets/github.png'
    };
  }

  componentWillMount() {
    this.pa = new ProductiveAbuser(config);
    this.pa.connect((ev) => this.onProductiveMessage(ev))
      .then(() => this.pa.fetchChannels())
      .then((channels) => channels.find((channel) => channel.tags.includes('productive-abuser')))
      .then((channel) => (this.channel = channel))
      .then(() => this.setState({isLoading: false, connectionError: null}))
      .catch((err) => {
        if (err instanceof Error) {
          throw err;
        }
        this.setState({isLoading: false, connectionError: err.toString()});
      });
  }

  componentWillUnmount() {
    this.pa.disconnect();
  }

  onProductiveMessage(ev) {
    if (!this.channel || ev.channelId !== this.channel.id) {
      this.pa.fetchChannel(ev.channelId).then((channel) => {
        if (channel.tags.includes('productive-abuser')) {
          this.channel = channel;
          this.setState({message: 'Hi Ivan!'});
        }
      });
      return;
    }

    const msg = ev.text.toLowerCase();
    if (msg === 'start') {
      this.setState({message: 'Oh really?', videoSrc: null, imageSrc: null});
      // setTimeout(() => this.setState({message: 'Productive abuser'}), 5000);
    } else if (msg === 'oh common') {
      this.setState({message: 'Nop!', videoSrc: null, imageSrc: null});
      // setTimeout(() => this.setState({message: 'Productive abuser'}), 5000);
    } else if (msg === 'pls start?') {
      this.setState({message: 'Okay, let\'s go!', videoSrc: null, imageSrc: null});
      setTimeout(() => this.setState({message: 'Wanna play a game?'}), 5000);
    } else if (msg === 'gdje je token?') {
      this.setState({videoSrc: '/assets/gdje-je-token.mp4', message: null});
    } else if (msg === 'github') {
      this.setState({imageSrc: '/assets/github.png', videoSrc: null});
    }
  }

  render(props, {message, isLoading, connectionError, videoSrc, imageSrc}) {
    return (
      <Home
        message={message}
        isLoading={isLoading}
        connectionError={connectionError}
        videoSrc={videoSrc}
        imageSrc={imageSrc}
      />
    );
  }
}
