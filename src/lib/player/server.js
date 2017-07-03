import ProductiveAbuser from '../productive-abuser';
import evented from '../utils/evented';
import config from '../config';
import store from '../store';

const server = evented({});
const productive = new ProductiveAbuser(config);

function fetchStations() {
  store.isLoadingStations = true;
  return productive.fetchChannels().then((channels) => {
    store.isLoadingStations = false;

    return channels.reduce((arr, channel) => {
      if (!channel.tags.includes('infinum-radio')) {
        return arr;
      }

      const tags = channel.tags.slice();
      tags.splice(tags.indexOf('infinum-radio'), 1);

      return arr.concat({
        id: channel.id,
        name: channel.name,
        tags,
        owner: channel.owner ? `${channel.owner.attributes.first_name} ${channel.owner.attributes.last_name}`.trim() : 'Nobody'
      });
    }, []);
  });
}

function fetchCommandsForStation(stationId) {
  return productive.fetchMessagesForChannel(stationId);
}

function connectToSocket() {
  productive.onChannelMessage((data) => {
    server.trigger('command', data.channelId, data.text);
  });
  productive.connect();
}

export default Object.assign(server, {
  connectToSocket,
  fetchStations,
  fetchCommandsForStation
});
