import entityFactory from "./EntityFactory.mjs";

export default class World {
  constructor(socket) {
    this.world = [];
    this.countId = 0;
    this.actionsBuffer = [];
    this.socket = socket || 'server';
  }
  //!!! WORLD.PUSH IS NOT A FUNCTION, PB DE SCOPE RETURN,FONCTION.0
  createPlayer(socket, id) {
    const player = entityFactory(this.world, 'player', { socket, id });
    const flag = this.createEntity('flag');
    //player.equip.function(player, flag);
    return player;
  }

  createEntity(type, id) {
    const entity = entityFactory(this.world, type, { id });
    return entity;
  }

  findBy(params) {
    if (Object.keys(params).length === 1) {
      const proprety = Object.keys(params)[0];
      const value = params[Object.keys(params)[0]];
      const foundEntity = this.world.find(entity => entity[proprety] === value);
      return foundEntity;
    }
  }

  display(params) {
    let display = ``;
    for (const entity of this.world) {
      display += `[`;
      Object.keys(params).forEach(param => {
        (typeof entity[param] !== 'object') ? display += `${entity[param]} ` : display += `${Object.entries(entity[param])} `
      });
      display += `],`
    }
    return display;
  }

  destroy(params) {
    const entity = this.findBy(params);
    (entity) ? entity.destroy() : '';
  }

  addActionToBuffer(clientActions) {
    //console.log('action', clientActions);
    const newAction = { value: null, timeStart: Date.now() };
    const newStack = {socket : clientActions.socket,actions:null};
    const stackExist = this.actionsBuffer.find(actionBuffer => actionBuffer.socket === clientActions.socket);
    clientActions.data.forEach(action => {
       if (!stackExist){
         const newStackCopy = {...newStack};
         const newActionCopy = {...newAction};
         newActionCopy.value = action;
         newStackCopy.actions = [newActionCopy];
         this.actionsBuffer.push(newStackCopy);
       } else {
        const actionExist = stackExist.actions.find(act => act.value === action);
        if (actionExist) {
              actionExist.timeStart = Date.now();
              return;
            } else {
              const newActionCopy = {...newAction};
              newActionCopy.value = action;
              stackExist.actions.push(newActionCopy);
            }
       }

    });

  }

  processActions() {
    (this.actionsBuffer.length > 0) ? console.log('actionsBuffer', this.actionsBuffer) : '';


    if (this.actionsBuffer.length > 0) {
      //Met a jour le buffer avec les actions terminées;
        this.actionsBuffer.forEach((stack,index) => {
        const entity = this.findBy({ socket: stack.socket });
        stack.actions.forEach((action,indexAct)=>{
          if (Date.now() - action.timeStart > entity[action.value].props.cooldown){
            stack.actions.splice(stack.actions[indexAct],1);
            (stack.actions.length < 1) ? this.actionsBuffer.splice(this.actionsBuffer[index],1) :'';
          }
        });
      });
    }

    
    if (this.actionsBuffer){
      for (const stackAction of this.actionsBuffer) {
        //Find entity and tell it to update
        const entity = this.findBy({ socket: stackAction.socket });
        if (!entity) { return console.error(`Entity not found, action can't be processed`) }
        stackAction.actions.forEach(newAction => {
          //entity[newAction.value].function(entity);
          console.log(entity);
          console.log('process',entity[newAction.value].function);
        });
      }
    }
    
    //this.actionsBuffer = [];
  }
  
  
  updateWorld(newWorld) {
    if (newWorld) {
      //Client side
      const oldEntitiesIds = this.world.map(entity => entity.id);
      const newEntitiesIds = newWorld.map(entity => entity.id);

      const lostEntities = this.world.filter(entity => !newEntitiesIds.includes(entity.id));
      const newEntities = newWorld.filter(entity => !oldEntitiesIds.includes(entity.id));

      lostEntities.forEach(entity => { entity.destroy() });
      newEntities.forEach(entity => {
        if (entity.type === "player") {
          this.createPlayer(entity.socket, entity.id);
        } else {
          this.createEntity(entity.type, entity.id);
        }
      });

      newWorld.forEach(entity => {
        let oldEnt = this.findBy({ id: entity.id });
        if (oldEnt) {
          oldEnt = Object.assign(oldEnt, entity);
        }
      });
    }
    this.processActions();
    //console.log(this.display({position:''}))
    return this.world;
  }
}
