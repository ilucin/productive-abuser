import {h, Component} from 'preact';
import s from './style';

export default class ConnectThree extends Component {
  render({board, p1, p2}) {
    return (
      <div class={s.connectThree}>
        {p1 && (<div class={s.connectThree_p1}> {p1} <br /> X </div>)}
        {p2 && (<div class={s.connectThree_p2}> {p2} <br /> O </div>)}

        {board ? (
          <div class={s.connectThree_board}>
            <pre>{board}</pre>
          </div>
        ) : (
          <h1> Connect three </h1>
        )}
      </div>
    );
  }
}
