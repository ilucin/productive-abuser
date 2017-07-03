import {h, Component} from 'preact';
import {action} from '../../lib/helpers';
import PongLoader from '../pong-loader';
import s from './style';

export default class TrackFood extends Component {
  onInputKeyup(ev) {
    var charCode = String(ev.which || ev.keyCode);
    if (charCode === '13') {
      this.props.applyToken(this.props.token);
    }
  }

  render({token, person, isLoading, isTokenError, updateToken, applyToken, isConnecting, connectionError}) {
    return (
      <section class={s.trackFood}>
        <div class={s.trackFood_box}>
          <div class={s.trackFood_title}> Food Tracker 2000 Pro </div>

          <input
            class={s.trackFood_tokenInput}
            type='password'
            value={token || ''}
            disabled={!!person || isLoading}
            onInput={updateToken}
            onKeyup={action(this, 'onInputKeyup')}
            placeholder='Write your token here'
          />

          {isConnecting &&
            <PongLoader />
          }

          {connectionError &&
            <div class={s.trackFood_tokenError}>
              {connectionError}
            </div>
          }

          {isTokenError &&
            <div class={s.trackFood_tokenError}>
              Token error
            </div>
          }

          {person &&
            <div class={s.trackFood_person}>
              Hi {person.firstName}! I am here to track your food.
            </div>
          }
        </div>
      </section>
    );
  }
}
