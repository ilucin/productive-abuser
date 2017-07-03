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
