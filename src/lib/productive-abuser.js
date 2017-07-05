import io from 'socket.io-client';

function serializeQueryParamValue(val) {
  return Array.isArray(val) ? val.join(',') : val;
}

function serializeQueryParams(params) {
  return Object.keys(params).reduce((arr, paramKey) => {
    const val = params[paramKey];
    if (!val) {
      return arr;
    }

    const keys = Object.keys(val);
    if (typeof val === 'object' && keys.length) {
      return arr.concat(keys.map((key) => `${paramKey}[${key}]=${serializeQueryParamValue(val[key])}`).join('&'));
    }

    return arr.concat(`${paramKey}=${Array.isArray(val) ? val.join(',') : val}`);
  }, []).join('&');
}

function getTextContentFromHtml(html) {
  const el = document.createElement('div');
  el.innerHTML = html;
  return el.textContent.trim();
}

function findRelationshipInIncluded(data, included, relationshipName, modelType) {
  return data.relationships[relationshipName].data ? included.find((model) => (
    data.relationships[relationshipName] &&
    model.type === modelType &&
    model.id === data.relationships[relationshipName].data.id
  )) : null;
}

function normalizePerson(person) {
  return person && {
    id: person.id,
    firstName: person.attributes.first_name,
    lastName: person.attributes.last_name,
    avatarUrl: person.attributes.avatar_url
  };
}

function normalizeChannel(task) {
  return task && {
    id: task.id,
    name: task.attributes.title,
    tags: task.attributes.tag_list.slice()
  };
}

// Required config:
// realtimeHost
// apiHost
// organizationId
// projectId
// token

export default function ProductiveAbuser(config) {
  this.config = config;
}

Object.assign(ProductiveAbuser.prototype, {
  connect(onMessage) {
    return new Promise((resolve, reject) => {
      this.fetchTokenPerson()
        .then((person) => {
          this.person = person;

          const {realtimeHost, token} = this.config;
          const socket = this.socket = io(realtimeHost, {path: '', autoConnect: true});

          socket.on('connect', () => {
            socket.emit('join', {token, person_id: person.id});
            resolve(person);
          });

          this._onChannelMessageHandler = onMessage;

          socket.on('new-notification', (...args) => {
            this._onSocketNewNotification(...args);
          });
        })
        .catch(reject);
    });
  },

  disconnect() {
    this.socket.disconnect();
    this.socket.off();
  },

  onChannelMessage(clb) {
    this._onChannelMessageHandler = clb;
  },

  fetchChannels() {
    const {projectId} = this.config;

    return this.depaginatedQuery('tasks', {filter: {project_id: projectId, status: '1'}})
      .then((responses) => (
        responses.reduce((arr, res) => (
          res.data.reduce((channels, task) => (
            channels.concat(Object.assign(normalizeChannel(task), {
              owner: normalizePerson(findRelationshipInIncluded(task, res.included, 'assignee', 'people'))
            }))
          ), arr)
        ), [])
      ));
  },

  fetchChannel(channelId) {
    return this.query(`tasks/${channelId}`)
      .then((res) => res.json())
      .then((res) => Object.assign(normalizeChannel(res.data), {
        owner: normalizePerson(findRelationshipInIncluded(res.data, res.included, 'assignee', 'people'))
      }));
  },

  fetchMessagesForChannel(channelId) {
    return this.depaginatedQuery('activities', {filter: {task_id: channelId}}).then((responses) => (
      responses.reduce((arr, res) => (
        res.data
          .filter((activity) => activity.attributes.item_type === 'comment')
          .reduce((messages, activity) => {
            const comment = res.included.find((model) => model.id === String(activity.attributes.item_id));
            if (comment && !comment.attributes.deleted_at) {
              const person = normalizePerson(findRelationshipInIncluded(comment, res.included, 'creator', 'people'));

              messages.push({
                id: comment.id,
                text: getTextContentFromHtml(comment.attributes.body),
                person
              });
            }
            return messages;
          }, arr)
      ), [])
    ));
  },

  fetchTokenPerson() {
    const {organizationId} = this.config;
    return this.query('organization_memberships', {filter: {organization_id: organizationId}}, {unscoped: true})
      .then((res) => res.json())
      .then((res) => {
        return normalizePerson(findRelationshipInIncluded(res.data[0], res.included, 'person', 'people'));
      });
  },

  ensureTokenPerson() {
    return this.person ? Promise.resolve(this.person) : this.fetchTokenPerson().then((person) => {
      this.person = person;
      return person;
    });
  },

  postMessageToChannel(channelId, message) {
    this.ensureTokenPerson().then((person) => {
      return this.query('comments', {}, {
        method: 'POST',
        headers: new Headers({
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json; charset=utf-8'
        }),
        body: JSON.stringify({
          data: {
            type: 'comments',
            attributes: {
              commentable_type: 'task',
              body: message
            },
            relationships: {
              attachments: {data: []},
              company: {data: null},
              creator: {data: null},
              invoice: {data: null},
              deal: {data: null},
              // creator: {data: {type: 'people', id: person.id}}
              person: {data: null},
              pinned_by: {data: null},
              task: {data: null}
            }
          }
        })
      }).then((res) => res.json())
        .then((comment) => {
          return this.query(`tasks/${channelId}`)
            .then((res) => res.json())
            .then((task) => {
              task.data.relationships.last_comment = {data: {type: 'comments', id: comment.data.id}};
              this.query(`tasks/${channelId}`, {}, {
                method: 'PUT',
                headers: new Headers({
                  'Accept': 'application/vnd.api+json',
                  'Content-Type': 'application/vnd.api+json; charset=utf-8'
                }),
                body: JSON.stringify({data: task.data})
              });
            });
        });
    });
  },

  query(endpoint, qp = {}, opts = {}) {
    const {apiHost, organizationId, token} = this.config;
    const endpointPrefix = (opts && opts.unscoped) ? '' : `${organizationId}/`;
    const qpNormalized = Object.assign({per_page: 100, page: 1, token}, qp);

    if (opts && opts.method !== 'GET') {
      delete qpNormalized.per_page;
      delete qpNormalized.page;
    }

    const qpSerialized = serializeQueryParams(qpNormalized);
    const url = `${apiHost}/api/v2/${endpointPrefix}${endpoint}?${qpSerialized}`;

    return new Promise(function(resolve, reject) {
      fetch(encodeURI(url), Object.assign({}, opts)).then((res) => {
        if (res.status >= 200 && res.status < 400) {
          resolve(res);
        } else {
          reject(res);
        }
      }).catch(reject);
    });
  },

  depaginatedQuery(endpoint, qp, opts) {
    let page = 1;
    const responses = [];

    const loadNextPage = () => (
      this.query(endpoint, Object.assign({}, qp, {page}), opts)
        .then((res) => res.json())
        .then((res) => {
          responses.push(res);

          if (page < res.meta.total_pages) {
            page++;
            return loadNextPage();
          }

          return responses;
        })
    );

    return Promise.resolve().then(loadNextPage);
  },

  _onSocketNewNotification(socketEvent) {
    console.log('socket event', socketEvent);
    this.query('notifications', {filter: {id: socketEvent.notification_id}, per_page: 1})
      .then((res) => res.json())
      .then((res) => this._onNewNotification({
        channelId: String(res.data[0].attributes.target_id),
        person: normalizePerson(findRelationshipInIncluded(res.data[0], res.included, 'actor', 'people')),
        text: getTextContentFromHtml(res.data[0].attributes.excerpt),
        title: getTextContentFromHtml(res.data[0].attributes.title)
      }));
  },

  _onNewNotification(msg) {
    if (this._onChannelMessageHandler) {
      this._onChannelMessageHandler(msg);
    }
  }
});
