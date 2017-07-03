import {h, Component} from 'preact';
import s from './style';

export default class PongLoader extends Component {
  render() {
    return (
      <div class={s.pongLoader}>
        <div class={s.pongLoader__playerOne} />
        <div class={s.pongLoader__playerTwo} />
        <div class={s.pongLoader__ball} />
      </div>
    );
  }
};
