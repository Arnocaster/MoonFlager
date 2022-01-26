import entityFactory from "./EntityFactory.mjs";

export default class World {
  constructor (socket) {
   this.world= [];
   this.countId= 0;
   this.actionsBuffer=[];
   this.socket = socket || 'server';
  }
    //!!! WORLD.PUSH IS NOT A FUNCTION, PB DE SCOPE RETURN,FONCTION.0
   createPlayer(socket) {
      const player = entityFactory(this.world,'player',socket);
      const flag = this.createEntity('flag');
      player.equip(flag);
      return player;
    }
    
    createEntity(type){
      const entity = entityFactory(this.world,type);
      return entity;
    }

    findBy(params) {
      if (Object.keys(params).length === 1){
        const proprety = Object.keys(params)[0];
        const value = params[Object.keys(params)[0]];
        const foundEntity = this.world.find(entity => entity[proprety] === value);
        return foundEntity;
      }
    }

    display(params) {
      let display = ``;
      for (const entity of this.world){
      display += `[`;
      Object.keys(params).forEach(param => {
        display += `${entity[param]} `;
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

   updateWorld(newWorld) {
     if (newWorld){
       //Server side
       console.log(newWorld);
       this.world = newWorld;
     }
      console.log('updateWorld');
      return this.world;
    }
  }
