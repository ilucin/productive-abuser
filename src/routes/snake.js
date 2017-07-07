import {h, Component} from 'preact';
import Snake from '../components/snake';
import config from '../lib/config';
import ProductiveAbuser from '../lib/productive-abuser';
import handleMessageForRouting from '../lib/routing-message-handlers';

export default class SnakeRoute extends Component {
  constructor() {
    super();
    this.state = {config: Object.assign({}, config)};
  }

  componentWillMount() {
    this.pa = new ProductiveAbuser(config);
    this.pa.connect((ev) => this.onProductiveMessage(ev));
  }

  componentWillUnmount() {
    this.pa.disconnect();
  }

  onProductiveMessage(ev) {
    handleMessageForRouting(ev);
  }

  render(props, {config}) {
    return (
      <Snake
        config={config}
      />
    );
  }
}
