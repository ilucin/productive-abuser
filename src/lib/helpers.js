export function action(ctx, actionName, ...curriedArgs) {
  ctx._actions = ctx._actions || {};

  if (!ctx._actions[actionName]) {
    if (!ctx[actionName]) {
      throw new Error(`Method "${actionName}" not found on component`);
    }
    ctx._actions[actionName] = function(...args) {
      return ctx[actionName].apply(ctx, curriedArgs.concat(args));
    };
  }

  return ctx._actions[actionName];
}

export function shuffleArray(inArray) {
  const array = inArray.slice();
  let counter = array.length;

  while (counter > 0) {
    const index = Math.floor(Math.random() * counter);
    counter--;
    const temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

export function without(arr, item) {
  const idx = arr.indexOf(item);
  if (idx >= 0) {
    const res = arr.slice();
    res.splice(idx, 1);
    return res;
  }
  return arr.slice();
}
