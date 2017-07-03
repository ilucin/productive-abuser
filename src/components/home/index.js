import {h, Component} from 'preact';
import s from './style';
import PongLoader from '../pong-loader';

export default class Home extends Component {
  render({message, isLoading, connectionError}) {
    console.log(message, isLoading, connectionError);
    return (
      <section class={s.home}>
        <div class={s.home_quickLinks}>
          <a href='/radio-player'> Player </a>
          <a href='/track-food'> Food </a>
          <a href='/checkers'> Checkers </a>
          <a href='/snake'> Snake </a>
        </div>

        <div class={s.home_box}>
          {isLoading ? (
            <PongLoader />
          ) : (
            <div class={s.home_title}> {message} </div>
          )}

          {connectionError &&
            <div class={s.home_error}>
              {connectionError}
            </div>
          }
        </div>
      </section>
    );
  }
}
