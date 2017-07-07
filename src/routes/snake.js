import {h, Component} from 'preact';
import {route} from 'preact-router';
import Snake from '../components/snake';
import config from '../lib/config';
import ProductiveAbuser from '../lib/productive-abuser';

export default class SnakeRoute extends Component {
  constructor() {
    super();
    this.state = {config: Object.assign({}, config, {
      token: '75cd5913-4eb3-4945-aca1-933506e11b9e',
      personId: '92'
    })};
  }

  componentWillMount() {
    this.pa = new ProductiveAbuser(config);
    this.pa.connect((ev) => this.onProductiveMessage(ev))
      .then(() => this.pa.fetchChannels())
      .then((channels) => channels.find((channel) => channel.tags.includes('productive-abuser')))
      .then((channel) => (this.channel = channel))
      .catch((err) => alert(err));
  }

  componentWillUnmount() {
    this.pa.disconnect();
  }

  onProductiveMessage(ev) {
    if (!this.channel || ev.channelId !== this.channel.id) {
      return;
    }

    if (ev.text.indexOf('zika') >= 0 || ev.text.indexOf('muzika') >= 0 || ev.text.indexOf('music') >= 0) {
      route('/radio-player');
    }
  }

  render(props, {config}) {
    return (
      <Snake
        config={config}
      />
    );
  }
}
