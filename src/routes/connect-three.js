import {h, Component} from 'preact';
import {route} from 'preact-router';
import ConnectThree from '../components/connect-three';
import config from '../lib/config';
import ProductiveAbuser from '../lib/productive-abuser';
import connectThree from '../lib/connect-three';
import handleMessageForRouting from '../lib/routing-message-handlers';

export default class ConnectThreeRoute extends Component {
  constructor() {
    super();
    this.playFor = {};
    this.state = {
      board: null,
      isLoading: true,
      connectionError: null
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
        alert(err);
        this.setState({isLoading: false, connectionError: err.toString()});
      });
  }

  componentWillUnmount() {
    this.pa.disconnect();
  }

  onProductiveMessage(ev) {
    handleMessageForRouting(ev);

    if (!this.channel || ev.channelId !== this.channel.id) {
      this.pa.fetchChannel(ev.channelId).then((channel) => {
        if (channel.tags.includes('snake')) {
          route('/snake');
        }
      });
      return;
    }

    const msg = ev.text.toLowerCase();
    const num = parseInt(msg, 10);
    if (msg.indexOf('play') >= 0 && msg.indexOf('connect three with') >= 0) {
      const p2 = ev.text.split('connect three with')[1].trim();
      const p1 = `${ev.person.firstName} ${ev.person.lastName}`.trim();

      if (p1 && p2) {
        this.playFor[p1] = connectThree(p1, p2);
        this.playFor[p2] = this.playFor[p1];

        if (!this.state.p1 && !this.state.p2) {
          this.setState({p1, p2});
        }
      }
    } else if (num > 0 && num < 10) {
      const p = `${ev.person.firstName} ${ev.person.lastName}`;

      if (!this.playFor[p]) {
        return;
      }

      const state = this.playFor[p](p, (num - 1) % 3, Math.floor((num - 1) / 3));
      this.pa.postMessageToChannel(this.channel.id, `<pre>${state}</pre>`);

      if (p === this.state.p1 || p === this.state.p2) {
        this.setState({board: state});
      }
    }
  }

  render(props, {board, p1, p2}) {
    return (
      <ConnectThree
        p1={p1}
        p2={p2}
        board={board}
      />
    );
  }
}
