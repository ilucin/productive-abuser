import {h, Component} from 'preact';
import s from './style';

export default class Snake extends Component {
  render({config}) {
    const configParam = encodeURIComponent(btoa(JSON.stringify(config)));
    return (
      <div class={s.snake}>
        <iframe
          src={`https://ilucin.github.io/snake?config=${configParam}`}
          class={s.snake_iframe}
          sandbox='allow-scripts'
        />
      </div>
    );
  }
}
