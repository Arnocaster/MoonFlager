import entityFactory from "./EntityFactory.mjs";
import physicEngine from "./physX/index.mjs";

export default class World {
  constructor(socket,physX) {
    this.world = [];
    this.countId = 0;
    this.socket = socket || 'server';
    this.prediction = [];
    this.actionBuffer = [];
    this.serverRate = 0;
    this.physx = physicEngine(physX);
    console.log(this.world);
  }

  //!!! WORLD.PUSH IS NOT A FUNCTION, PB DE SCOPE RETURN,FONCTION.0
  createPlayer(socket, id) {
    const player = entityFactory(this.world,this.physx, 'player', { socket, id });
    const flag = this.createEntity('flag');
    player.equip(player, flag);
    return player;
  }

  createEntity(type, id) {
    const entity = entityFactory(this.world, this.physx, type, { id });
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

  interpolatePosition(entity) {
    const now = Date.now();
    //!Approx, should be server rate => Need to find a solution
    const renderTs = now-100;
    let buffer = entity.bufferPosition;
    //console.log(buffer,buffer[0].x-buffer[buffer.length-1].x);
    if ((buffer[buffer.length-1].x-buffer[0].x !== 0
        || buffer[buffer.length-1].y-buffer[0].y !== 0 
        || buffer[buffer.length-1].angle-buffer[0].angle !== 0 )) {
    buffer.splice(0, buffer.length - 2);
    //console.log(buffer[0],buffer[1],buffer[2],buffer.length);

    //console.log('buffer',buffer[0].ts,buffer[1].ts,buffer[1].ts-buffer[0].ts,renderTs-buffer[0].ts,renderTs-buffer[1].ts);
      const x0 = buffer[0].x;
      const x1 = buffer[buffer.length-1].x;
      const y0 = buffer[0].y;
      const y1 = buffer[buffer.length-1].y;
      const angle0 = buffer[0].angle;
      const angle1 = buffer[buffer.length-1].angle;
      const t0 = buffer[0].ts;
      const t1 = buffer[buffer.length-1].ts;
      //
      //console.log('x0', x0, "+(x1-x0)", x1 - x0, "*(renderTs-t0)", renderTs - t0, "/(t1-t0)", t1 - t0);
        entity.position.angle = angle0 + (angle1-angle0) * (renderTs - t0) / (t1-t0);
        entity.position.x = x0 + (x1-x0) * (renderTs - t0) / (t1-t0);
        entity.position.y = y0 + (y1-y0) * (renderTs - t0) / (t1-t0);
        //console.log('Interpolated!!!!');
        //entity.bufferPosition.shift();
        return entity;
    } else {
      entity.position = buffer[buffer.length-1];
      entity.bufferPosition.splice(0,entity.bufferPosition.length-2);
      return entity;
    }

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
            this.prediction = this.prediction.filter(stack => stack.inputCount >= buffEntity.lastProcessedAction);
          } else {
            buffEntity.position['ts'] = Date.now();
            entity.bufferPosition.push(buffEntity.position);
          }
        }
      }
      //
      this.world.forEach(entity => {
        if (entity.socket !== this.socket) {
          if (entity.bufferPosition.length > 0){
          entity = this.interpolatePosition(entity);
          }
        }
      });

      //PREDICTION : every time - client entity only
      this.prediction.forEach((stack, index) => {
        const entity = this.findBy({ socket: this.socket });
        if (entity) {
          //!UPDATE PHYSX
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
        //!UPDATE PHYSX
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
