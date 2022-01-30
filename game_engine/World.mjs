import entityFactory from "./EntityFactory.mjs";

export default class World {
  constructor(socket) {
    this.world = [];
    this.countId = 0;
    this.socket = socket || 'server';
  }
  //!!! WORLD.PUSH IS NOT A FUNCTION, PB DE SCOPE RETURN,FONCTION.0
  createPlayer(socket, id) {
    const player = entityFactory(this.world, 'player', { socket, id });
    const flag = this.createEntity('flag');
    player.equip(player, flag);
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
    const entityElt = this.findBy({ socket: clientActions.socket });
    entityElt.actionBuffer.push(clientActions.data[0]);
  }

  processActions(bufferWorld) {
    console.log('1 LOOOOOOOOOOOOOOOOOOOOOOOOOOOOP ---');
    for (const entity of this.world) {
      //For each entity
      //CLIENT ONLY
      if (bufferWorld) {
        const buffEnt = bufferWorld.find(buffEntity => buffEntity.id === entity.id);
        //UPDATE POSITION
        entity.position = buffEnt.position;
        console.log((entity.socket === this.socket), entity.socket, this.socket);
        if (entity.socket === this.socket) {
          //For each action in client side
          console.log(entity.actionBuffer);
          entity.actionBuffer = entity.actionBuffer.filter(stack => stack.inputCount >= buffEnt.lastProcessedAction);
          entity.actionBuffer.forEach((stack, index) => {
            // console.log('stack',stack);
             if (stack.deltaTs > 39 / 1000) {
               stack.actions.forEach(action => entity[action](entity,stack.deltaTs));
               entity.actionBuffer.splice(index,1);
               if (index === entity.actionBuffer.length - 1) { entity.lastProcessedAction = stack.inputCount }
             }
            });
          console.log(entity.actionBuffer);
        }

      }
      //END CLIENT PART
      //console.log(entity.actionBuffer)
      entity.actionBuffer.forEach((stack, index) => {
        // console.log('stack',stack);
        if (stack.deltaTs > 39 / 1000) {
          stack.actions.forEach(action => entity[action](entity, stack.deltaTs));
          entity.actionBuffer.splice(index, 1);
          if (index === entity.actionBuffer.length - 1) { entity.lastProcessedAction = stack.inputCount }
        }
      });

      //(this.socket === 'server') ? entity.actionBuffer = [] : '';


    }
  }


  updateWorld(bufferWorld, bufferInput) {
    if (bufferWorld) {
      //Client side with authoritative world sended
      const oldEntitiesIds = this.world.map(entity => entity.id);
      const newEntitiesIds = bufferWorld.map(entity => entity.id);

      const lostEntities = this.world.filter(entity => !newEntitiesIds.includes(entity.id));
      const newEntities = bufferWorld.filter(entity => !oldEntitiesIds.includes(entity.id));

      lostEntities.forEach(entity => { entity.destroy() });
      newEntities.forEach(entity => {
        if (entity.type === "player") {
          this.createPlayer(entity.socket, entity.id);
        } else {
          this.createEntity(entity.type, entity.id);
        }
      });

    }
    this.processActions(bufferWorld);
    //console.log(this.display({position:''}))
    return this.world;
  }
}
