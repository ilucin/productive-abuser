import {h, Component} from 'preact';
import config from '../lib/config';
import TrackFood from '../components/track-food';
import ProductiveAbuser from '../lib/productive-abuser';
import {action} from '../lib/helpers';
import handleMessageForRouting from '../lib/routing-message-handlers';

export default class TrackFoodRoute extends Component {
  constructor() {
    super();
    this.state = {
      token: localStorage.getItem('trackFoodToken'),
      isLoading: false,
      isTokenError: false,
      person: null,
      isConnecting: true,
      connectionError: null
    };
  }

  componentWillMount() {
    this.pa = new ProductiveAbuser(config);
    this.pa.connect((ev) => this.onProductiveMessage(ev))
      .then((person) => this.setState({isConnecting: false, connectionError: null}))
      .catch((connectionError) => this.setState({isConnecting: false, connectionError}));
  }

  componentWillUnmount() {
    if (this.pa) {
      this.pa.disconnect();
    }

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
    localStorage.setItem('trackFoodToken', this.state.token);

    this.paPerson.fetchTokenPerson()
      .then((person) => this.setState({person, isLoading: false, isTokenError: false}))
      .catch(() => this.setState({isLoading: false, isTokenError: true}));
  }

  onProductiveMessage(ev) {
    handleMessageForRouting(ev);

    const person = this.state.person;
    if (person && ev.person.id === person.id && ev.text.indexOf('Danas sam jeo') === 0) {
      const food = ev.text.split('Danas sam jeo')[1].trim();

      this.paPerson.query('time_entries', {}, {
        method: 'POST',
        headers: new Headers({
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json; charset=utf-8'
        }),
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
              service: {data: {type: 'services', id: config.foodServiceId}},
              approver: {data: null},
              task: {data: null}
            }
          }
        })
      }).then(() => alert(food))
        .catch((err) => alert(err));
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
