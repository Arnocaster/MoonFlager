export function actions(params, newEntity) {
  const actionsComponent = {
    equip: (entity,what) => {
      entity.equipped = {...what};
      what.destroy();
    },

    use: (entity) => {
      if (entity.equipped){entity.equipped.usage(entity);return;};
      console.error('Use : This entity has no equipment');
    },

    drop: (entity) => {
      console.log(entity)
      if (entity.equipped){
      //!!!! SUPPRIMER LA SHALLOW COPY POUR QUE L'OBJET SUIVE LE JOUEUR;
      entity.equipped.position = {...entity.position};
      entity.addToWorld(entity.equipped);
      entity.equipped = null;
      return;}
      console.error('Drop : This entity has no equipment');
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
