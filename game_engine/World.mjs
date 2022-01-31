import entityFactory from "./EntityFactory.mjs";

export default class World {
  constructor(socket) {
    this.world = [];
    this.countId = 0;
    this.socket = socket || 'server';
    this.prediction = [];
    this.actionBuffer = [];
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
    if (this.socket === 'server') {
      clientActions.data[0]['socket'] = clientActions.socket;
      this.actionBuffer.push(clientActions.data[0]);
      //console.log("push server", this.actionBuffer);
    } else {
      this.prediction.push(clientActions.data[0]);
      //console.log("push client", this.prediction, this.actionBuffer);
    }
  }

  processActions(bufferWorld) {
    //console.log('------------------------');

    //!CLIENT
    if (this.socket !== "server") {
      if (bufferWorld) {
        for (const buffEntity of bufferWorld) {
          const entity = this.findBy({ id: buffEntity.id });
          entity.position = buffEntity.position;
          if (buffEntity.socket === this.socket) {
            this.prediction = this.prediction.filter(stack => stack.inputCount > buffEntity.lastProcessedAction);
          }
        }
      }
      this.prediction.forEach((stack, index) => {
        const entity = this.findBy({ socket: this.socket });
        if (entity){
        stack.actions.forEach(action => entity[action](entity, stack.deltaTs));
        }
      });
      this.prediction = [];
    }
    //!SERVER
    if (this.socket === "server") {
      let index = 0;
      for (let stack of this.actionBuffer) {
        const entity = this.findBy({ socket: stack.socket });
        stack.actions.forEach(action => entity[action](entity, stack.deltaTs));
        entity.lastProcessedAction = stack.inputCount;
        index++;
      };
      this.actionBuffer = [];
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
