export function actions(params) {
  const actionsComponent = {
    equip: (what) => {
      const entityIndex = world.findIndex(entity => entity.id === what.id);
      entityIndex ? world.splice(entityIndex, 1) : console.log('No index');
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
  if (params){
    const actions = {};
    Object.keys(params.actions).forEach(param=>{
      actions[param] = actionsComponent[param];
    });
    return actions
  }

}
