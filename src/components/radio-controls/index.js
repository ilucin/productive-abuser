import {h, Component} from 'preact';
import s from './style';

export default class RadioControls extends Component {
  render({isNextEnabled, onNext}) {
    return (
      <div class={s.radioControls}>
        <button type='button' class={s.radioControls_button} disabled={!isNextEnabled} onClick={onNext}>
          Next
        </button>
      </div>
    );
  }
}
