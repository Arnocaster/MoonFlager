export function actions(params, newEntity) {
  const actionsComponent = {
    equip: (entity,what) => {
      entity.equipped = what;
      what.destroy();
    },

    use: (entity) => {
      entity.equipped.usage();
    },

    drop: (entity) => {
      world.push(entity.equipped);
      entity.equipped = null;
    },
    
    
  }
  if (params) {
    const actions = {};
    Object.keys(params.actions).forEach(param => {
      actions[param] = actionsComponent[param];
    });
    return actions
  }

}
