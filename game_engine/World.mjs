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

  interpolatePosition(entity){
    const now = Date.now();
    //!Approx, should be server rate??? Need to find a solution
    const renderTs = now-20;
    let buffer = entity.bufferPosition;
    buffer.splice(0,buffer.length-2);
    // while (buffer.length >= 2 && buffer[1][0] <= renderTs) {
    //   buffer.shift();
    // }
    //console.log('buffer',buffer[0].ts,buffer[1].ts,buffer[1].ts-buffer[0].ts,renderTs-buffer[0].ts,renderTs-buffer[1].ts);
    // if (buffer[0].ts <= renderTs && buffer[1] <= renderTs){
      const x0 =buffer[0].x;
      const x1 = buffer[1].x;
      const y0 = buffer[0].y;
      const y1 = buffer[1].y;
      const angle0 = buffer[0].angle;
      const angle1 = buffer[1].angle;
      const t0 = buffer[0].ts;
      const t1 = buffer[1].ts;
      //
      console.log('x0',x0,"+(x1-x0)",x1-x0,"*(renderTs-t0)",renderTs-t0,"/(t1-t0)",t1-t0 );
      entity.position.x = x0 + (x1-x0) * (renderTs - t0) / (t1-t0);
      entity.position.y = y0 + (y1-y0) * (renderTs - t0) / (t1-t0);
      entity.position.angle = angle0 + (angle1-angle0) * (renderTs - t0) / (t1-t0);
      console.log('Interpolated!!!!');
     
    // }
    
    return entity.position;

  }

  processActions(bufferWorld) {
    //console.log('------------------------');

    //!CLIENT
    if (this.socket !== "server") {
      //If server send a new world
      if (bufferWorld) {
        for (const buffEntity of bufferWorld) {
          const entity = this.findBy({ id: buffEntity.id });
          //RECONCILIATION FILTER
          if (buffEntity.socket === this.socket) {
            this.prediction = this.prediction.filter(stack => stack.inputCount > buffEntity.lastProcessedAction);
          } else {
            buffEntity.position['ts'] = Date.now();
            entity.bufferPosition.push(buffEntity.position);
          }
        }
      }
      this.world.forEach(entity =>{
        if (entity.socket !== this.socket){
        entity.position = this.interpolatePosition(entity);
        }
      });
      
      //PREDICTION : every time - client entity only
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
          const player = this.createPlayer(entity.socket, entity.id);
          player.position = entity.position;
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
