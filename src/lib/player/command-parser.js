const linkRegexp = /http(.*)youtube(.*)v=/g;

export default function parseCommand(text) {
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
  const links = text.split(' ')
    .reduce((arr, str) => (str.match(linkRegexp) ? arr.concat(str) : arr), []);

  if (links.length) {
    return {type: 'addToPlaylist', urls: links};
  }

  return null;
}
