import {h, Component} from 'preact';
import Player from '../components/player';

export default class RadioPlayerRoute extends Component {
  render() {
    return (
      <Player isLoading />
    );
  }
}
