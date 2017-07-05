import {h, Component} from 'preact';
import PlayerLayout from '../components/player-layout';
import PongLoader from '../components/pong-loader';
import RadioStationList from '../components/radio-station-list';
import YoutubePlayer from '../components/youtube-player';
import RadioPlaylist from '../components/radio-playlist';
import RadioControls from '../components/radio-controls';
import ProductiveAbuser from '../lib/productive-abuser';
import config from '../lib/config';
import {action, shuffleArray} from '../lib/helpers';
import {messageToCommand, channelToStation, commandToSongs, addCommandSongsToPlaylist} from '../lib/player';
import resolveYtPlayerAPI from '../lib/resolve-yt-player-api';

export default class RadioPlayerRoute extends Component {
  constructor() {
    super();
    this.state = {
      stations: [],
      playlist: [],
      currentSong: null,
      currentStation: null,
      isLoading: true,
      isLoadingPlaylist: false,
      connectionError: null
    };
  }

  componentWillMount() {
    this.paPlayer = new ProductiveAbuser(config);
    this.paPlayer.connect((ev) => this.onProductiveMessage(ev))
      .then(() => this.paPlayer.fetchChannels())
      .then((channels) => channels.filter((channel) => channel.tags.includes('radio-player') || channel.tags.includes('infinum-radio')))
      .then((channels) => channels.map(channelToStation))
      .then((stations) => this.setState({stations, isLoading: false, connectionError: null}))
      .catch((err) => {
        if (err instanceof Error) {
          throw err;
        }
        this.setState({isLoading: false, connectionError: err.toString()});
      });
  }

  componentWillUnmount() {
    clearInterval(this.playlistWatchTimer);
    this.paPlayer.disconnect();
  }

  onCommandAddToPlaylist(command) {
    this.setState({playlist: addCommandSongsToPlaylist(command, this.state.playlist)});

    if (!this.state.currentSong || !this.state.currentSong.isRealtime) {
      this.playNext();
    }
  }

  onCommandAddRandomToPlaylist(cmd) {
    this.paPlayer.fetchMessagesForChannel(cmd.stationId).then((messages) => {
      if (!this.state.currentStation || this.state.currentStation.id !== cmd.stationId) {
        return;
      }

      const commands = messages.map(messageToCommand).filter((command) => command.type === 'addToPlaylist');
      const command = Math.floor(Math.random() * commands.length);

      if (!command) {
        return;
      }

      this.setState({playlist: addCommandSongsToPlaylist(command, this.state.playlist)});

      if (!this.state.currentSong) {
        this.playNext();
      }
    });
  }

  onProductiveMessage(ev) {
    const command = messageToCommand(ev);
    const {currentStation} = this.state;
    command.isRealtime = true;

    if (!currentStation || command.stationId !== currentStation.id) {
      return;
    }

    if (command.type === 'play') {
      this.youtubePlayer && this.youtubePlayer.play();
    } else if (command.type === 'stop') {
      this.youtubePlayer && this.youtubePlayer.stop();
    } else if (command.type === 'next') {
      this.youtubePlayer && this.youtubePlayer.next();
    } else if (command.type === 'ytPlayerCall') {
      this.youtubePlayer && this.youtubePlayer.ytPlayerCall(command.method, command.args);
    } else if (command.type === 'addToPlaylist') {
      this.onCommandAddToPlaylist(command);
    } else if (command.type === 'addRandomToPlaylist') {
      this.onCommandAddRandomToPlaylist(command);
    }
  }

  onStationSelect(station) {
    if (this.state.currentStation === station) {
      return;
    }

    clearInterval(this.playlistWatchTimer);

    if (this.youtubePlayer && this.youtubePlayer.isPlaying()) {
      this.youtubePlayer.stop();
    }

    this.setState({currentStation: station, isLoadingPlaylist: true});
    this.paPlayer.fetchMessagesForChannel(station.id).then((messages) => {
      if (this.state.currentStation !== station) {
        return;
      }

      const commands = messages.map(messageToCommand);
      station.commands = commands.filter((command) => command.type === 'addToPlaylist');

      const songs = station.commands.reduce((arr, command) => arr.concat(commandToSongs(command)), []);
      station.shuffledSongs = shuffleArray(songs);
      this.setState({playlist: station.shuffledSongs.splice(0, 5), isLoadingPlaylist: false});
      this.playNext();

      this.playlistWatchTimer = setInterval(() => this.addSongsForInfinitePlayback(station), 2000);
    });
  }

  registerYoutubePlayer(api) {
    this.youtubePlayer = api;

    if (this.state.currentSong) {
      this.youtubePlayer.loadVideoByUrl(this.state.currentSong.url);
    }
  }

  resolveYtPlayerAPI() {
    return resolveYtPlayerAPI();
  }

  onYoutubePlayerPlaybackEnd() {
    this.playNext();
  }

  addSongsForInfinitePlayback(station) {
    const {currentStation, playlist} = this.state;
    if (currentStation !== station || playlist.length > 3 || !station.commands || station.commands.length === 0 || !station.shuffledSongs) {
      return;
    }

    if (station.shuffledSongs.length === 0) {
      const songs = station.commands.reduce((arr, command) => arr.concat(commandToSongs(command)), []);
      station.shuffledSongs = shuffleArray(songs);
    }

    this.setState({playlist: this.state.playlist.concat(station.shuffledSongs.splice(0, 5))});
    if (!this.state.currentSong) {
      this.playNext();
    }
  }

  playNext() {
    const playlist = this.state.playlist;
    if (!playlist || playlist.length === 0) {
      return;
    }

    const currentSong = playlist[0];
    this.setState({playlist: playlist.slice(1), currentSong});

    if (this.youtubePlayer) {
      this.youtubePlayer.loadVideoByUrl(currentSong.url);
    }
  }

  render(props, {isLoading, isLoadingPlaylist, connectionError, stations, currentStation, playlist}) {
    return (
      <PlayerLayout
        radioStationsSlot={
          isLoading ? (
            <PongLoader message='Loading stations' />
          ) : (
            <RadioStationList
              stations={stations}
              currentStation={currentStation}
              selectStation={action(this, 'onStationSelect')}
            />
          )
        }
        youtubePlayerSlot={
          <YoutubePlayer
            registerController={action(this, 'registerYoutubePlayer')}
            getYtPlayerAPI={action(this, 'resolveYtPlayerAPI')}
            onPlaybackEnd={action(this, 'onYoutubePlayerPlaybackEnd')}
          />
        }
        radioPlaylistSlot={
          isLoadingPlaylist ? (
            <PongLoader message='Loading playlist' />
          ) : (
            <RadioPlaylist
              station={currentStation}
              playlist={playlist}
            />
          )
        }
        radioControlsSlot={
          <RadioControls
            isNextEnabled={playlist.length > 0}
            onNext={action(this, 'playNext')}
          />
        }
      />
    );
  }
}
