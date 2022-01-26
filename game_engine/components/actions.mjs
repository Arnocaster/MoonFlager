export function actions(params, newEntity) {
  const actionsComponent = {
    equip: (what) => {
      const whatEntity = newEntity.findBy({ id: what.id });
      whatEntity ? whatEntity.destroy() : console.log('No index');
      newEntity.equipped = what;
    },

    use: () => {
      newEntity.equipped.usage();
    },

    usage: () => {
      newEntity.drop();
    },

    drop: () => {
      world.push(newEntity.equipped);
      newEntity.equipped = null;
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
