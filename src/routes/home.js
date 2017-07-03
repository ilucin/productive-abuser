import {h, Component} from 'preact';
import Home from '../components/home';
import config from '../lib/config';
import ProductiveAbuser from '../lib/productive-abuser';
import connectThree from '../lib/connect-three';

export default class HomeRoute extends Component {
  constructor() {
    super();
    this.state = {
      message: 'Welcome to Productive Abuser',
      isLoading: true,
      connectionError: null
    };
  }

  componentWillMount() {
    window.hr = this;
    this.paHome = window.paHome = new ProductiveAbuser(config);
    this.paHome.connect((ev) => this.onProductiveMessage(ev))
      .then((person) => this.setState({isLoading: false, connectionError: null}))
      .then(() => this.paHome.fetchChannels())
      .then((channels) => channels.find((channel) => channel.tags.includes('productive-abuser')))
      .then((channel) => (this.channel = channel))
      .catch((err) => {
        if (err instanceof Error) {
          throw err;
        }
        this.setState({isLoading: false, connectionError: err.toString()});
      });
  }

  componentWillUnmount() {
    this.paHome.disconnect();
  }

  onProductiveMessage(ev) {
    if (!this.channel || ev.channelId !== this.channel.id) {
      this.paHome.fetchChannel(ev.channelId).then((channel) => {
        if (channel.owner.id === this.paHome.person.id && channel.tags.includes('productive-abuser')) {
          this.channel = channel;
          this.setState({message: 'Hi Ivan!'});
        }
      });
      return;
    }

    const msg = ev.message.toLowerCase();
    if (msg === 'start') {
      this.setState({message: 'Oh really?'});
      // setTimeout(() => this.setState({message: 'Productive abuser'}), 5000);
    } else if (msg === 'oh common') {
      this.setState({message: 'Nop!'});
      // setTimeout(() => this.setState({message: 'Productive abuser'}), 5000);
    } else if (msg === 'pls start?') {
      this.setState({message: 'Okay, let\'s go!'});
      setTimeout(() => this.setState({message: 'Wanna play a game?'}), 5000);
    } else if (msg.indexOf('play') >= 0 && msg.indexOf('snake') >= 0) {
      console.log('start snake');
    } else if (msg.indexOf('play') >= 0 && msg.indexOf('connect three with') >= 0) {
      const p2 = ev.message.split('connect three with')[1].trim();
      const p1 = `${ev.creator.firstName} ${ev.creator.lastName}`.trim();

      if (p1 && p2) {
        this.playConnectThree = connectThree(p1, p2);
      }
    } else if (msg.indexOf('connect three ') === 0 && this.playConnectThree) {
      const p = `${ev.creator.firstName} ${ev.creator.lastName}`;
      const moves = msg.split('connect three ')[1].split(' ');
      const state = this.playConnectThree(p, parseInt(moves[0], 10), parseInt(moves[1], 10));
      this.paHome.postMessageToChannel(this.channel.id, `<pre> ${state} </pre>`);
    }
  }

  render(props, {message, isLoading, connectionError}) {
    return (
      <Home
        message={message}
        isLoading={isLoading}
        connectionError={connectionError}
      />
    );
  }
}
