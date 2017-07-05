import {h, Component} from 'preact';
import s from './style';
import {action} from '../../lib/helpers';

export default class RadioStationItem extends Component {
  onClick() {
    if (!this.props.isCurrent) {
      this.props.selectStation(this.props.station);
    }
  }

  render({station, isCurrent, selectStation}) {
    return (
      <div
        class={`${s.radioStationItem} ${isCurrent ? s.radioStationItem__isCurrent : ''}`}
        onClick={action(this, 'onClick')}
      >
        <div class={s.radioStationItem_name}> {station.name} </div>
        <div class={s.radioStationItem_owner}>
          By: {station.owner ? station.owner.firstName : 'God'}
        </div>
        <div class={s.radioStationItem_tags}>
          {station.tags.map((tag) => (
            <div class={s.radioStationItem_tag}> {tag} </div>
          ))}
        </div>
      </div>
    );
  }
}
