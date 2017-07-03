import {h, Component} from 'preact';
import {Router} from 'preact-router';
import HomeRoute from '../routes/home';
import TrackFoodRoute from '../routes/track-food';
import RadioPlayerRoute from '../routes/radio-player';

export default class App extends Component {
  handleRoute = (e) => {
    this.currentUrl = e.url;
  }

  render() {
    return (
      <main id='app'>
        <Router onChange={this.handleRoute}>
          <HomeRoute path='/' />
          <RadioPlayerRoute path='/radio-player' />
          <TrackFoodRoute path='/track-food' />
        </Router>
      </main>
    );
  }
}
