import {h, Component} from 'preact';
import s from './style';

export default class PongLoader extends Component {
  render({message}) {
    return (
      <div class={s.pongLoader}>
        {message &&
          (<div class={s.pongLoader_message}> {message} </div>)
        }
        <div class={s.pongLoader_pong}>
          <div class={s.pongLoader__playerOne} />
          <div class={s.pongLoader__playerTwo} />
          <div class={s.pongLoader__ball} />
        </div>
      </div>
    );
  }
};
