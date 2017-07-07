import {route} from 'preact-router';
import config from './config';

export default function routingMessageHandler(ev) {
  if (ev.person.id !== config.presenterPersonId) {
    return;
  }

  const msg = ev.text.toLowerCase();
  if (msg.indexOf('ne da mi se vise raditi') >= 0 || msg.indexOf('krizic kruzic') >= 0) {
    route('/connect-three');
  } else if (msg.indexOf('go home') >= 0) {
    route('/');
  } else if (msg.indexOf('snake') >= 0) {
    route('/snake');
  } else if (msg.indexOf('muzik') >= 0) {
    route('/radio-player');
  } else if (msg.indexOf('food') >= 0) {
    route('/track-food');
  }
}
