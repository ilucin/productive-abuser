import {h, Component} from 'preact';
import s from './style';

export default class PlayerLayout extends Component {
  render({radioStationsSlot, youtubePlayerSlot, radioPlaylistSlot, radioControlsSlot}) {
    return (
      <section class={s.player}>
        <div class={s.player_leftPane}>
          {radioStationsSlot}
        </div>
        <div class={s.player_rightPane}>
          <div class={s.player_rightTopPane}>
            {youtubePlayerSlot}
          </div>

          <div class={s.player_rightBottomPane}>
            <div class={s.player_playlistSlot}>
              {radioPlaylistSlot}
            </div>

            <div class={s.player_controlsSlot}>
              {radioControlsSlot}
            </div>
          </div>
        </div>
      </section>
    );
  }
}
