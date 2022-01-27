export function actions(params, newEntity) {
  const actionsComponent = {
    equip: (entity,what) => {
      // const whatEntity = entity.findBy({ id: what.id });
      // whatEntity ? whatEntity.destroy() : console.log('No index');
      // entity.equipped = what;
    },

    use: (entity) => {
      entity.equipped.usage();
    },

    usage: (entity) => {
      entity.drop();
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
