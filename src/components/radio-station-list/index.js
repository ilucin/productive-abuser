import {h, Component} from 'preact';
import RadioStationItem from '../radio-station-item';
import s from './style';

export default class RadioStationList extends Component {
  render({stations, currentStation, ...props}) {
    return (
      <div class={s.radioStationList}>
        {stations.map((station) => (
          <RadioStationItem
            station={station}
            isCurrent={station === currentStation}
            {...props}
          />
        ))}
      </div>
    );
  }
}
