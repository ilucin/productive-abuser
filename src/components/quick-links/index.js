import {h, Component} from 'preact';
import s from './style';

export default class Home extends Component {
  render() {
    return (
      <div class={s.quickLinks}>
        <a href='/'> Home </a>
        <a href='/radio-player'> Player </a>
        <a href='/track-food'> Food </a>
        <a href='/connect-three'> Connect three </a>
        <a href='/snake'> Snake </a>
      </div>
    );
  }
}
