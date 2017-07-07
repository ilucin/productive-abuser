import {h, Component} from 'preact';
import {Router} from 'preact-router';
import Home from '../routes/home';
import TrackFood from '../routes/track-food';
import RadioPlayer from '../routes/radio-player';
import ConnectThree from '../routes/connect-three';
import Snake from '../routes/snake';
import QuickLinks from './quick-links';

export default class App extends Component {
  handleRoute = (e) => {
    this.currentUrl = e.url;
  }

  render() {
    return (
      <main id='app'>
        <QuickLinks />
        <Router onChange={this.handleRoute}>
          <Home path='/' />
          <Home path='/finish' finish />
          <RadioPlayer path='/radio-player' />
          <TrackFood path='/track-food' />
          <ConnectThree path='/connect-three' />
          <Snake path='/snake' />
        </Router>
      </main>
    );
  }
}
