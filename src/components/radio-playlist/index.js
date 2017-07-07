import {h, Component} from 'preact';
import s from './style';

export default class RadioPlaylist extends Component {
  render({playlist, station, currentSong}) {
    if (!station) {
      return (<div class={s.radioPlaylist} />);
    }

    if (playlist.length === 0) {
      return (
        <div class={s.radioPlaylist}> Playlist is empty! </div>
      );
    }

    return (
      <div class={s.radioPlaylist}>
        <div class={s.radioPlaylist_station}>
          <div> Likes: <b> {station.likeCount} </b> </div>
          {currentSong && (
            <div> Current song played by: {currentSong.person.firstName} {currentSong.person.lastName} </div>
          )}
        </div>
        <ol class={s.radioPlaylist_list}>
          {playlist.map((song) => (
            <li class={`${s.radioPlaylist_song} ${song.isRealtime ? s.radioPlaylist_songRealtime : ''}`}>
              <span class={s.radioPlaylist_songPerson}> {song.person.firstName} {song.person.lastName} </span>
              <span class={s.radioPlaylist_songArrow}> ~> </span>
              <a href={song.url} target='_blank' rel='noopener' class={s.radioPlaylist_songLink}> {song.url} </a>
            </li>
          ))}
        </ol>
      </div>
    );
  }
}
