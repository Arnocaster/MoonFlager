import entityFactory from "./EntityFactory.mjs";

export default class World {
  constructor(socket) {
    this.world = [];
    this.countId = 0;
    this.actionsBuffer = [];
    this.socket = socket || 'server';
  }
  //!!! WORLD.PUSH IS NOT A FUNCTION, PB DE SCOPE RETURN,FONCTION.0
  createPlayer(socket) {
    const player = entityFactory(this.world, 'player', socket);
    const flag = this.createEntity('flag');
    player.equip(flag);
    return player;
  }

  createEntity(type) {
    const entity = entityFactory(this.world, type);
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
    this.findBy(params).destroy();
  }

  init() {

  }

  processActions() {
    //(this.actionsBuffer.length > 0) ? console.log('actionBuffer', this.actionsBuffer) : '';

    if (this.actionsBuffer.length > 0) {
      for (const stackAction of this.actionsBuffer) {
        //Find entity and tell it to update
        const entity = this.findBy({ socket: stackAction.socket });
        if (!entity) { return console.error(`Entity not found, action can't be processed`) }
        const newActions = stackAction.data.flat();
        newActions.forEach(newAction => {
          entity[newAction](entity);
          //console.log(entity[newAction]());
        });
        console.log("actions after process", entity.position);
      }
    };

    this.actionsBuffer = [];
  }


updateWorld(newWorld) {
  if (newWorld) {
    //Server side
    this.world = newWorld;
    this.actionsBuffer = [];
  }
  this.processActions();
  //console.log(this.display({position:''}))
  return this.world;
}
  }
