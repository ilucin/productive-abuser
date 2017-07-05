import {without} from './helpers';
const linkRegexp = /http(.*)youtube(.*)v=/g;

export function parseCommand(text) {
  // console.log('Command: ', text);
  const splits = text.split(' ');

  if (text === 'play') {
    return {type: 'play'};
  } else if (text === 'stop') {
    return {type: 'stop'};
  } else if (text === 'next') {
    return {type: 'next'};
  } else if (text.startsWith('player ')) {
    return {type: 'ytPlayerCall', method: splits[1], args: splits.slice(2)};
  } else if (text.startsWith('random')) {
    return {type: 'addRandomToPlaylist'};
  }

  // try to extract youtube links from text
  const links = text.split(' ').reduce(function(arr, str) {
    return str.match(linkRegexp) ? arr.concat(str) : arr;
  }, []);

  if (links.length) {
    return {type: 'addToPlaylist', urls: links};
  }

  return null;
};

export function messageToCommand(message) {
  return Object.assign({}, message, parseCommand(message.text), {
    stationId: message.channelId
  });
}

export function channelToStation(channel) {
  return Object.assign({}, channel, {
    commands: [],
    shuffledCommands: [],
    tags: without(without(channel.tags, 'radio-player'), 'infinum-radio')
  });
}

export function commandToSongs(command) {
  return command.urls ? command.urls.map((url) => ({
    url, person: command.person, isRealtime: command.isRealtime
  })) : [];
}

export function addCommandSongsToPlaylist(command, playlist) {
  const songs = commandToSongs(command);

  if (!command.isRealtime) {
    return playlist.concat(songs);
  }

  let idxOfLastRealtimeSong;

  for (let i = 0; i < playlist.length; i++) {
    if (!playlist[i].isRealtime) {
      idxOfLastRealtimeSong = i - 1;
      break;
    }
  }

  return playlist.slice(0, idxOfLastRealtimeSong + 1)
    .concat(songs)
    .concat(playlist.slice(idxOfLastRealtimeSong + 1));
}
