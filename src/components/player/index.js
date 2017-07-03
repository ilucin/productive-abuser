import {h, Component} from 'preact';
import s from './style';
import RadioStationList from '../radio-station-list';
import PongLoader from '../pong-loader';

export default class Player extends Component {
  render(props, state) {
    return (
      <section class={s.player}>
        <div class={s.player__leftPane}>
          {props.isLoading ? (
            <PongLoader />
          ) : (
            <RadioStationList
              stations={props.stations}
              activeStation={props.activeStation} />
          )}
        </div>
        <div class={s.player__rightPane}>
          Right
        </div>
      </section>
    );
  }
}
