import {h, Component} from 'preact';
import Home from '../components/home';
import config from '../lib/config';
import ProductiveAbuser from '../lib/productive-abuser';
import handleMessageForRouting from '../lib/routing-message-handlers';

export default class HomeRoute extends Component {
  constructor() {
    super();
    this.state = {
      message: 'Infinum Showoff 2017',
      isLoading: true,
      connectionError: null,
      videoSrc: null,
      imageSrc: null
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
    handleMessageForRouting(ev);
    const msg = ev.text.toLowerCase();

    if (ev.person.id === config.presenterPersonId && msg.indexOf('tanja') >= 0) {
      this.setState({message: null, videoSrc: null, imageSrc: '/assets/tanja.png'});
    }

    if (!this.channel || ev.channelId !== this.channel.id) {
      this.pa.fetchChannel(ev.channelId).then((channel) => {
        if (channel.tags.includes('productive-abuser')) {
          this.channel = channel;
          this.setState({message: 'Hi Ivan!', videoSrc: null, imageSrc: null});
        }
      });
      return;
    }

    if (msg === 'let\'s start') {
      this.setState({message: 'Oh really?', videoSrc: null, imageSrc: null});
      // setTimeout(() => this.setState({message: 'Productive abuser'}), 5000);
    } else if (msg === 'oh common') {
      this.setState({message: 'Nop!', videoSrc: null, imageSrc: null});
      // setTimeout(() => this.setState({message: 'Productive abuser'}), 5000);
    } else if (msg === 'pls start?') {
      this.setState({message: 'Okay, let\'s go!', videoSrc: null, imageSrc: null});
      setTimeout(() => this.setState({message: 'State of Producitve'}), 5000);
    } else if (msg.indexOf('gdje je token?') >= 0) {
      this.setState({videoSrc: '/assets/gdje-je-token.mp4', message: null});
    } else if (msg.indexOf('gdje je kod?') >= 0) {
      this.setState({imageSrc: '/assets/github.png', videoSrc: null, message: null});
    } else if (msg === 'let\'s abuse productive') {
      this.setState({message: 'Welcome to Productive Abuser', videoSrc: null, imageSrc: null});
    } else if (msg.indexOf('music room') >= 0) {
      this.setState({imageSrc: '/assets/music-academy-extra.png', videoSrc: null, message: null});
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
