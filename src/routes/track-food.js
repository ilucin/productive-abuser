import {h, Component} from 'preact';
import config from '../lib/config';
import TrackFood from '../components/track-food';
import ProductiveAbuser from '../lib/productive-abuser';
import {action} from '../lib/helpers';

export default class TrackFoodRoute extends Component {
  constructor() {
    super();
    window.trackFoodRoute = this;
    this.state = {
      token: window.localStorage.getItem('trackFoodToken'),
      isLoading: false,
      isTokenError: false,
      person: null,
      isConnecting: true,
      connectionError: null
    };

    this.paFoodTracker = new ProductiveAbuser(config);
    this.paFoodTracker.connect((ev) => this.onPaFoodTrackerMessage(ev))
      .then((person) => this.setState({isConnecting: false, connectionError: null}))
      .catch((connectionError) => this.setState({isConnecting: false, connectionError}));
  }

  componentWillUnmount() {
    this.paFoodTracker.disconnect();

    if (this.paPerson) {
      this.paPerson.disconnect();
    }
  }

  onTokenChange(ev) {
    this.setState({token: ev.target.value});
  }

  onTokenApply() {
    this.paPerson = new ProductiveAbuser(Object.assign({}, config, {token: this.state.token}));
    this.setState({isLoading: true});
    window.localStorage.setItem('trackFoodToken', this.state.token);

    this.paPerson.fetchTokenPerson()
      .then((person) => this.setState({person, isLoading: false, isTokenError: false}))
      .catch(() => this.setState({isLoading: false, isTokenError: true}));
  }

  onPaFoodTrackerMessage(ev) {
    const person = this.state.person;
    if (person && ev.creator.id === person.id && ev.message.indexOf('I ate some') === 0) {
      const food = ev.message.split('I ate some')[1].trim();

      this.paPerson.query('time_entries', {
        method: 'POST',
        body: JSON.stringify({
          data: {
            type: 'time-entries',
            attributes: {
              time: 30,
              billable_time: 30,
              date: new Date().toJSON().split('T')[0],
              note: food
            },
            relationships: {
              person: {data: {type: 'people', id: person.id}},
              service: {data: {type: 'services', id: '1'}},
              approver: {data: null},
              task: {data: null}
            }
          }
        })
      }).then(() => window.alert(food))
        .catch((err) => window.alert(err));
    }
  }

  render(props, {token, person, isLoading, isTokenError, isConnecting, connectionError}) {
    return (
      <TrackFood
        token={token}
        person={person}
        isLoading={isLoading}
        isTokenError={isTokenError}
        isConnecting={isConnecting}
        connectionError={connectionError}
        updateToken={action(this, 'onTokenChange')}
        applyToken={action(this, 'onTokenApply')}
      />
    );
  }
}
