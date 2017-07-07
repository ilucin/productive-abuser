import {h, Component} from 'preact';
import {Router} from 'preact-router';
import Home from '../routes/home';
import TrackFood from '../routes/track-food';
import RadioPlayer from '../routes/radio-player';
import ConnectThree from '../routes/connect-three';
import Snake from '../routes/snake';
// import config from '../lib/config';
// import ProductiveAbuser from '../lib/productive-abuser';
import QuickLinks from './quick-links';

// const presentationSteps = [
//   {route: '/'},
//   {route: '/connect-three'},
//   {route: '/snake'},
//   {route: '/track-food'},
//   {route: '/radio-player'},
//   {route: '/finish'}
// ];

export default class App extends Component {
  // constructor() {
  //   super();
  //   this.presentationStepIdx = 0;
  // }

  handleRoute = (e) => {
    this.currentUrl = e.url;
  }

  // componentWillMount() {
  //   this.pa = new ProductiveAbuser(config);
  //   this.pa.connect((ev) => this.onProductiveMessage(ev))
  //     .catch((err) => alert(err));
  // }
  //
  // componentWillUnmount() {
  //   this.pa.disconnect();
  // }
  //
  // onProductiveMessage(ev) {
  //   if (ev.person.id !== config.presenterPersonId) {
  //     return;
  //   }
  //
  //   const text = ev.text.toLowerCase();
  //   if (text === 'ajmo dalje') {
  //     this.presentationStepIdx++;
  //     route(presentationSteps[this.presentationStepIdx].route);
  //   } else if (text.indexOf('play') >= 0 && text.indexOf('snake') >= 0) {
  //     console.log('start snake');
  //   }
  // }

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
