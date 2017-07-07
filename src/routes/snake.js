import {h, Component} from 'preact';
import Snake from '../components/snake';
import config from '../lib/config';

export default class SnakeRoute extends Component {
  constructor() {
    super();
    this.state = {config: Object.assign({}, config, {
      token: '75cd5913-4eb3-4945-aca1-933506e11b9e',
      personId: '92'
    })};
  }

  render(props, {config}) {
    return (
      <Snake
        config={config}
      />
    );
  }
}
