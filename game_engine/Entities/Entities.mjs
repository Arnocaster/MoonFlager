import {Player, Flag } from '../index.mjs'

export default class Entities {
  #classes

  constructor(world) {
    this.id = Entities.idCounter;
    this.#classes = { Player, Flag };
    return this;
  }

  get classes() {
    return this.#classes;
  }

  static get idCounter(){
    Entities._counter = (Entities._counter || 0 ) + 1;
    return Entities._counter;
  }

  create(type,params){
    if (this.#classes[type]){
      const newEnt = new this.#classes[type];
      if (params){
      Object.keys(params).forEach(param =>{
        newEnt[param] = params[param];
      });
      }
      return newEnt;
    }
    console.error(`This type ${type}doesn't exist`);
  }


  entitiesWithClasses(entities) {
    const wrappedEntities = {};
    Object.keys(entities).forEach(type => {
      entities[type].forEach(entitie => {
        if (!wrappedEntities[type]) {
          wrappedEntities[type] = [this.create(type,entitie)];
        } else {
          wrappedEntities[type].push(this.create(type,entitie));
        }
      });
    });
    return wrappedEntities;
  }
  //use
  //pick
  drop(entity,parent) {
    return;
  }

  equip(entity){
    //console.log('this equip',this.equipped = entity);
    if (this.equipped === null){
      this.equipped = entity;
    }
    console.log('equip',this.equipped);
  }

  processActions(actions) {
    if (Object.keys(actions).length > 0) {
      actions.forEach(stack => {
        for (const movment of stack.data[0]) {
          console.log(stack);
          const entityElt = this.find({id:stack.id});
          if (entityElt[movment]) {
            entityElt[movment]();
          } else {
            console.error(`Movment ${movment}not found`);
          }
        }
      });
    }

  }
}