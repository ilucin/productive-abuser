function assert(str, cond) {
  if (!cond) {
    throw new Error(str);
  }
}

export default function assignEventedInstance(obj) {
  let handlers = {};

  function on(ev, clb) {
    assert('ev has to be a string', ev && typeof ev === 'string');
    assert('clb has to be a function', clb && typeof clb === 'function');
    handlers[ev] = handlers[ev] || [];
    handlers[ev].push(clb);
  }

  function off(ev, clb) {
    if (ev) {
      if (handlers[ev]) {
        if (clb) {
          const idx = handlers[ev].indexOf(clb);

          if (idx >= 0) {
            handlers[ev].splice(idx, 1);
          }
        } else {
          handlers[ev] = [];
        }
      }
    } else {
      handlers = {};
    }
  }

  function trigger(ev, ...args) {
    if (handlers[ev]) {
      for (let i = 0; i < handlers[ev].length; i++) {
        handlers[ev][i](...args);
      }
    }
  }

  return Object.assign(obj, {on, off, trigger});
}
